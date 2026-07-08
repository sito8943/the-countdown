import { useConvex, useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../convex/_generated/api'
import heroImg from './assets/hero.png'
import './App.css'

const PROFILE_STORAGE_KEY = 'the-countdown:profile'
const COUNTDOWN_CACHE_STORAGE_KEY = 'the-countdown:countdown-cache'
const DAY_IN_MS = 24 * 60 * 60 * 1000
const HOUR_IN_MS = 60 * 60 * 1000
const MINUTE_IN_MS = 60 * 1000
const SECOND_IN_MS = 1000

type SetupStep = 'idle' | 'nickname' | 'partner' | 'sync' | 'days'

type LocalProfile = {
  nickname: string
  partnerNickname?: string
}

type Countdown = {
  initialDays: number
  placedAt: number
  ownerNickname: string
  createdAt?: number
  updatedAt?: number
}

type CountdownState = {
  profile: {
    nickname: string
    partnerNickname?: string
  } | null
  countdown: Countdown | null
}

function cleanNickname(nickname: string) {
  return nickname.trim()
}

function normalizeNickname(nickname: string) {
  return cleanNickname(nickname).toLowerCase()
}

function readLocalProfile(): LocalProfile | null {
  const rawValue = window.localStorage.getItem(PROFILE_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<LocalProfile>

    if (!parsedValue.nickname || typeof parsedValue.nickname !== 'string') {
      return null
    }

    return {
      nickname: parsedValue.nickname,
      partnerNickname:
        typeof parsedValue.partnerNickname === 'string'
          ? parsedValue.partnerNickname
          : undefined,
    }
  } catch {
    return null
  }
}

function saveLocalProfile(profile: LocalProfile) {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

function areSameLocalProfile(
  firstProfile: LocalProfile | null,
  secondProfile: LocalProfile,
) {
  return (
    firstProfile?.nickname === secondProfile.nickname &&
    firstProfile.partnerNickname === secondProfile.partnerNickname
  )
}

function readCachedCountdownState(): CountdownState | null {
  const rawValue = window.localStorage.getItem(COUNTDOWN_CACHE_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<CountdownState>
    const profile = parsedValue.profile
    const countdown = parsedValue.countdown

    if (
      !profile ||
      typeof profile.nickname !== 'string' ||
      !countdown ||
      typeof countdown.ownerNickname !== 'string' ||
      typeof countdown.initialDays !== 'number' ||
      typeof countdown.placedAt !== 'number' ||
      !Number.isFinite(countdown.initialDays) ||
      !Number.isFinite(countdown.placedAt)
    ) {
      return null
    }

    return {
      profile: {
        nickname: profile.nickname,
        partnerNickname:
          typeof profile.partnerNickname === 'string'
            ? profile.partnerNickname
            : undefined,
      },
      countdown: {
        initialDays: Math.max(0, Math.floor(countdown.initialDays)),
        placedAt: countdown.placedAt,
        ownerNickname: countdown.ownerNickname,
        createdAt:
          typeof countdown.createdAt === 'number'
            ? countdown.createdAt
            : undefined,
        updatedAt:
          typeof countdown.updatedAt === 'number'
            ? countdown.updatedAt
            : undefined,
      },
    }
  } catch {
    return null
  }
}

function saveCountdownCache(state: CountdownState) {
  if (!state.profile || !state.countdown) {
    return
  }

  window.localStorage.setItem(
    COUNTDOWN_CACHE_STORAGE_KEY,
    JSON.stringify({
      profile: state.profile,
      countdown: state.countdown,
      cachedAt: Date.now(),
    }),
  )
}

function getInitialLocalProfile() {
  return readLocalProfile() ?? readCachedCountdownState()?.profile ?? null
}

function getRemainingMs(countdown: Countdown | null, now = Date.now()) {
  if (!countdown) {
    return 0
  }

  const totalMs = countdown.initialDays * DAY_IN_MS

  return Math.max(0, totalMs - Math.max(0, now - countdown.placedAt))
}

function getRemainingDays(countdown: Countdown | null, now = Date.now()) {
  if (!countdown) {
    return null
  }

  const remainingMs = getRemainingMs(countdown, now)

  return remainingMs === 0 ? 0 : Math.ceil(remainingMs / DAY_IN_MS)
}

function getElapsedDays(countdown: Countdown | null, now = Date.now()) {
  if (!countdown) {
    return 0
  }

  const elapsedMs = Math.max(0, now - countdown.placedAt)

  return Math.min(countdown.initialDays, Math.floor(elapsedMs / DAY_IN_MS))
}

function getDurationParts(remainingMs: number) {
  const days = Math.floor(remainingMs / DAY_IN_MS)
  const hours = Math.floor((remainingMs % DAY_IN_MS) / HOUR_IN_MS)
  const minutes = Math.floor((remainingMs % HOUR_IN_MS) / MINUTE_IN_MS)
  const seconds = Math.floor((remainingMs % MINUTE_IN_MS) / SECOND_IN_MS)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

function padTimeUnit(value: number) {
  return value.toString().padStart(2, '0')
}

function formatPlacedDate(placedAt: number) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(placedAt))
}

function getNicknameError(nickname: string) {
  const cleanValue = cleanNickname(nickname)

  if (cleanValue.length < 2) {
    return 'Escribe al menos 2 caracteres.'
  }

  if (cleanValue.length > 32) {
    return 'Usa 32 caracteres o menos.'
  }

  return ''
}

function App() {
  const convex = useConvex()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [localProfile, setLocalProfile] = useState<LocalProfile | null>(() =>
    getInitialLocalProfile(),
  )
  const [cachedCountdownState, setCachedCountdownState] =
    useState<CountdownState | null>(() => readCachedCountdownState())
  const [setupStep, setSetupStep] = useState<SetupStep>('idle')
  const [nicknameInput, setNicknameInput] = useState('')
  const [partnerInput, setPartnerInput] = useState('')
  const [daysInput, setDaysInput] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [syncCandidate, setSyncCandidate] = useState<CountdownState | null>(
    null,
  )
  const [pendingCountdownState, setPendingCountdownState] =
    useState<CountdownState | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const viewer = useQuery(
    api.countdowns.getByNickname,
    localProfile?.nickname ? { nickname: localProfile.nickname } : 'skip',
  ) as CountdownState | undefined
  const saveProfile = useMutation(api.countdowns.saveProfile)
  const createCountdown = useMutation(api.countdowns.createCountdown)
  const syncWithProfile = useMutation(api.countdowns.syncWithProfile)

  const matchingCachedState =
    cachedCountdownState?.countdown &&
    cachedCountdownState.profile?.nickname &&
    localProfile?.nickname &&
    normalizeNickname(cachedCountdownState.profile.nickname) ===
      normalizeNickname(localProfile.nickname)
      ? cachedCountdownState
      : null
  const activeState = viewer?.countdown
    ? viewer
    : pendingCountdownState?.countdown
      ? pendingCountdownState
      : matchingCachedState?.countdown
        ? matchingCachedState
        : viewer || pendingCountdownState || matchingCachedState
  const activeProfile = activeState?.profile ?? null
  const countdown = activeState?.countdown ?? null
  const remainingMs = useMemo(
    () => getRemainingMs(countdown, now),
    [countdown, now],
  )
  const remainingTime = useMemo(
    () => (countdown ? getDurationParts(remainingMs) : null),
    [countdown, remainingMs],
  )
  const elapsedDays = useMemo(
    () => getElapsedDays(countdown, now),
    [countdown, now],
  )
  const progress = useMemo(() => {
    if (!countdown) {
      return 0
    }

    const totalMs = countdown.initialDays * DAY_IN_MS

    if (totalMs === 0) {
      return 100
    }

    return Math.min(100, Math.round(((totalMs - remainingMs) / totalMs) * 100))
  }, [countdown, remainingMs])
  const syncCandidateRemainingDays = useMemo(
    () => getRemainingDays(syncCandidate?.countdown ?? null),
    [syncCandidate],
  )
  const timeReadout = {
    days: remainingTime ? padTimeUnit(remainingTime.days) : 'dd',
    hours: remainingTime ? padTimeUnit(remainingTime.hours) : 'hh',
    minutes: remainingTime ? padTimeUnit(remainingTime.minutes) : 'mm',
    seconds: remainingTime ? padTimeUnit(remainingTime.seconds) : 'ss',
  }
  const timeReadoutLabel = remainingTime
    ? `${remainingTime.days} dias, ${remainingTime.hours} horas, ${remainingTime.minutes} minutos y ${remainingTime.seconds} segundos restantes`
    : 'Cargando tiempo restante'

  useEffect(() => {
    if (viewer?.countdown) {
      saveCountdownCache(viewer)
      setCachedCountdownState(viewer)
      setPendingCountdownState(null)
    }

    if (viewer?.profile) {
      const nextLocalProfile = {
        nickname: viewer.profile.nickname,
        partnerNickname: viewer.profile.partnerNickname,
      }

      saveLocalProfile(nextLocalProfile)
      setLocalProfile((currentProfile) =>
        areSameLocalProfile(currentProfile, nextLocalProfile)
          ? currentProfile
          : nextLocalProfile,
      )
    }
  }, [viewer])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, SECOND_IN_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!localProfile?.nickname) {
      setSetupStep('nickname')
      return
    }

    if (viewer === undefined) {
      return
    }

    if (
      !viewer.countdown &&
      !pendingCountdownState?.countdown &&
      !matchingCachedState?.countdown &&
      setupStep === 'idle'
    ) {
      setPartnerInput(localProfile.partnerNickname ?? '')
      setSetupStep(localProfile.partnerNickname ? 'days' : 'partner')
    }
  }, [
    localProfile,
    matchingCachedState,
    pendingCountdownState,
    setupStep,
    viewer,
  ])

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (setupStep === 'idle') {
      if (dialog.open) {
        dialog.close()
      }
      return
    }

    if (!dialog.open) {
      dialog.showModal()
    }
  }, [setupStep])

  async function handleNicknameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const error = getNicknameError(nicknameInput)

    if (error) {
      setFormError(error)
      return
    }

    const nickname = cleanNickname(nicknameInput)

    try {
      setIsSubmitting(true)
      await saveProfile({ nickname })

      const nextProfile = { nickname }
      saveLocalProfile(nextProfile)
      setLocalProfile(nextProfile)
      setPartnerInput('')
      setSetupStep('partner')
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar tu nickname.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePartnerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname) {
      setSetupStep('nickname')
      return
    }

    const error = getNicknameError(partnerInput)

    if (error) {
      setFormError(error)
      return
    }

    const partnerNickname = cleanNickname(partnerInput)

    if (
      normalizeNickname(localProfile.nickname) ===
      normalizeNickname(partnerNickname)
    ) {
      setFormError('Usa el nickname de la otra persona.')
      return
    }

    try {
      setIsSubmitting(true)

      const nextProfile = {
        nickname: localProfile.nickname,
        partnerNickname,
      }

      await saveProfile(nextProfile)
      saveLocalProfile(nextProfile)
      setLocalProfile(nextProfile)

      const partnerState = (await convex.query(api.countdowns.getByNickname, {
        nickname: partnerNickname,
      })) as CountdownState

      if (partnerState.profile && partnerState.countdown) {
        setSyncCandidate(partnerState)
        setSetupStep('sync')
        return
      }

      setSetupStep('days')
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'No se pudo revisar ese nickname.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSyncSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname || !syncCandidate?.profile?.nickname) {
      setSetupStep('partner')
      return
    }

    try {
      setIsSubmitting(true)
      const nextState = (await syncWithProfile({
        nickname: localProfile.nickname,
        partnerNickname: syncCandidate.profile.nickname,
      })) as CountdownState

      const nextProfile = {
        nickname: localProfile.nickname,
        partnerNickname: syncCandidate.profile.nickname,
      }

      setPendingCountdownState(nextState)
      saveCountdownCache(nextState)
      setCachedCountdownState(nextState)
      saveLocalProfile(nextProfile)
      setLocalProfile(nextProfile)
      setSetupStep('idle')
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'No se pudo sincronizar el countdown.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCreateOwnCountdown() {
    setSyncCandidate(null)
    setFormError('')
    setSetupStep('days')
  }

  async function handleDaysSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname) {
      setSetupStep('nickname')
      return
    }

    const parsedDays = Number(daysInput)

    if (!Number.isInteger(parsedDays) || parsedDays < 0) {
      setFormError('Escribe un numero entero de dias.')
      return
    }

    try {
      setIsSubmitting(true)
      const nextState = (await createCountdown({
        nickname: localProfile.nickname,
        partnerNickname: localProfile.partnerNickname,
        initialDays: parsedDays,
      })) as CountdownState
      setPendingCountdownState(nextState)
      saveCountdownCache(nextState)
      setCachedCountdownState(nextState)
      setDaysInput('')
      setSetupStep('idle')
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el countdown.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderDialogContent() {
    if (setupStep === 'nickname') {
      return (
        <form className="setup-form" onSubmit={handleNicknameSubmit}>
          <div>
            <p className="eyebrow">Primer inicio</p>
            <h2>Tu nickname</h2>
            <p>Este nombre identifica tu countdown en Convex.</p>
          </div>

          <label htmlFor="nickname">Nickname</label>
          <input
            id="nickname"
            type="text"
            value={nicknameInput}
            onChange={(event) => {
              setNicknameInput(event.target.value)
              setFormError('')
            }}
            autoFocus
          />

          {formError ? <p className="field-error">{formError}</p> : null}

          <button
            type="submit"
            className="primary-action"
            disabled={isSubmitting}
          >
            Continuar
          </button>
        </form>
      )
    }

    if (setupStep === 'partner') {
      return (
        <form className="setup-form" onSubmit={handlePartnerSubmit}>
          <div>
            <p className="eyebrow">Sincronizacion</p>
            <h2>Nickname de ella</h2>
            <p>
              Si ya existe y tiene conteo, te preguntare si quieres unirte a ese
              countdown.
            </p>
          </div>

          <label htmlFor="partner-nickname">Nickname de la otra persona</label>
          <input
            id="partner-nickname"
            type="text"
            value={partnerInput}
            onChange={(event) => {
              setPartnerInput(event.target.value)
              setFormError('')
            }}
            autoFocus
          />

          {formError ? <p className="field-error">{formError}</p> : null}

          <button
            type="submit"
            className="primary-action"
            disabled={isSubmitting}
          >
            Revisar nickname
          </button>
        </form>
      )
    }

    if (setupStep === 'sync') {
      return (
        <form className="setup-form" onSubmit={handleSyncSubmit}>
          <div>
            <p className="eyebrow">Conteo encontrado</p>
            <h2>Sincronizarse?</h2>
            <p>
              {syncCandidate?.profile?.nickname} ya tiene un countdown
              {syncCandidateRemainingDays !== null
                ? ` con ${syncCandidateRemainingDays} dias restantes`
                : ''}
              .
            </p>
          </div>

          {formError ? <p className="field-error">{formError}</p> : null}

          <div className="dialog-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={handleCreateOwnCountdown}
              disabled={isSubmitting}
            >
              Crear el mio
            </button>
            <button
              type="submit"
              className="primary-action"
              disabled={isSubmitting}
            >
              Sincronizarme
            </button>
          </div>
        </form>
      )
    }

    if (setupStep === 'days') {
      return (
        <form className="setup-form" onSubmit={handleDaysSubmit}>
          <div>
            <p className="eyebrow">Countdown</p>
            <h2>Cuantos dias faltan?</h2>
            <p>
              Este conteo quedara guardado en Convex para poder compartirlo.
            </p>
          </div>

          <label htmlFor="initial-days">Dias restantes</label>
          <input
            id="initial-days"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={daysInput}
            onChange={(event) => {
              setDaysInput(event.target.value)
              setFormError('')
            }}
            autoFocus
          />

          {formError ? <p className="field-error">{formError}</p> : null}

          <button
            type="submit"
            className="primary-action"
            disabled={isSubmitting}
          >
            Guardar countdown
          </button>
        </form>
      )
    }

    return null
  }

  return (
    <main className="countdown-shell">
      <section className="countdown-hero" aria-labelledby="countdown-title">
        <div className="hero-copy">
          <p className="eyebrow">Cuba esta cerca</p>
          <h1 id="countdown-title">Nuestro countdown</h1>
        </div>
      </section>

      <section className="countdown-card" aria-live="polite">
        <div className="profile-row">
          <span className="status-pill">
            {activeProfile?.nickname ?? localProfile?.nickname ?? 'Sin perfil'}
          </span>
          {activeProfile?.partnerNickname ? (
            <span className="status-pill muted-pill">
              con {activeProfile.partnerNickname}
            </span>
          ) : null}
        </div>

        <div className="countdown-readout">
          <div
            className={`time-scale${remainingTime ? '' : ' is-loading'}`}
            aria-label={timeReadoutLabel}
          >
            <span className="time-part time-days">
              {remainingTime ? (
                <strong>{timeReadout.days}</strong>
              ) : (
                <small>dd</small>
              )}
            </span>
            <span className="time-colon">:</span>
            <span className="time-part time-hours">
              {remainingTime ? (
                <strong>{timeReadout.hours}</strong>
              ) : (
                <small>hh</small>
              )}
            </span>
            <span className="time-colon">:</span>
            <span className="time-part time-minutes">
              {remainingTime ? (
                <strong>{timeReadout.minutes}</strong>
              ) : (
                <small>mm</small>
              )}
            </span>
            <span className="time-colon">:</span>
            <span className="time-part time-seconds">
              {remainingTime ? (
                <strong>{timeReadout.seconds}</strong>
              ) : (
                <small>ss</small>
              )}
            </span>
          </div>
          <p className="readout-caption">dias restantes</p>
        </div>

        <div className="progress-block">
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-meta">
            <span>{progress}% recorrido</span>
            <span>
              {countdown
                ? `${elapsedDays} de ${countdown.initialDays} dias`
                : localProfile?.nickname
                  ? 'Esperando configurar el conteo'
                  : 'Esperando tu nickname'}
            </span>
          </div>
        </div>

        {countdown ? (
          <div className="settings-summary">
            <p>
              Conteo creado por {countdown.ownerNickname} el{' '}
              {formatPlacedDate(countdown.placedAt)}. Convex mantiene el mismo
              contador para los nicknames sincronizados.
            </p>
          </div>
        ) : (
          <p className="loading-copy">
            {viewer === undefined && localProfile?.nickname
              ? 'Cargando countdown compartido...'
              : 'Completa los pasos iniciales para empezar.'}
          </p>
        )}
      </section>

      <dialog
        ref={dialogRef}
        className="setup-dialog"
        onCancel={(event) => {
          if (setupStep !== 'idle') {
            event.preventDefault()
          }
        }}
      >
        {renderDialogContent()}
      </dialog>
    </main>
  )
}

export default App
