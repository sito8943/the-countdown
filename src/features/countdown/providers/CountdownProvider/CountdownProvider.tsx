import { useConvex, useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { t } from '../../../../lang'
import { DAY_IN_MS, SECOND_IN_MS } from '../../../../shared/constants'
import type { CountdownState, LocalProfile } from '../../../../shared/models'
import { storageService } from '../../../../shared/services'
import {
  areSameNickname,
  getDurationParts,
  getElapsedDays,
  getNicknameError,
  getRemainingDays,
  getRemainingMs,
  NICKNAME_ERROR,
  normalizeNickname,
  padTimeUnit,
} from '../../../../shared/utils'
import { SETUP_STEP } from '../../constants'
import type { SetupStep } from '../../constants'
import { CountdownContext } from './context'
import type { CountdownContextValue } from './types'

function nicknameErrorMessage(nickname: string) {
  const error = getNicknameError(nickname)

  if (error === NICKNAME_ERROR.TOO_SHORT) {
    return t.errors.nicknameTooShort
  }

  if (error === NICKNAME_ERROR.TOO_LONG) {
    return t.errors.nicknameTooLong
  }

  return ''
}

function resolveErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function areSameLocalProfile(first: LocalProfile | null, second: LocalProfile) {
  return (
    first?.nickname === second.nickname &&
    first.partnerNickname === second.partnerNickname
  )
}

export function CountdownProvider({ children }: { children: ReactNode }) {
  const convex = useConvex()
  const [localProfile, setLocalProfile] = useState<LocalProfile | null>(() =>
    storageService.getInitialLocalProfile(),
  )
  const [cachedCountdownState, setCachedCountdownState] =
    useState<CountdownState | null>(() =>
      storageService.readCachedCountdownState(),
    )
  const [setupStep, setSetupStep] = useState<SetupStep>(SETUP_STEP.IDLE)
  const [nicknameInput, setNicknameInput] = useState('')
  const [partnerInput, setPartnerInput] = useState('')
  const [daysInput, setDaysInput] = useState('')
  const [eyebrowInput, setEyebrowInput] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [messageCopied, setMessageCopied] = useState(false)
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
  const updateMessages = useMutation(api.countdowns.updateMessages)
  const sendMessage = useMutation(api.countdowns.sendMessage)

  const matchingCachedState =
    cachedCountdownState?.countdown &&
    cachedCountdownState.profile?.nickname &&
    localProfile?.nickname &&
    areSameNickname(
      cachedCountdownState.profile.nickname,
      localProfile.nickname,
    )
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
  const displayEyebrow = countdown?.eyebrow ?? t.defaults.eyebrow
  const displayTitle = countdown?.title ?? t.defaults.title
  // Message received from the partner: stored under the partner's nickname.
  const partnerNickname = activeProfile?.partnerNickname
  const receivedMessage =
    partnerNickname && countdown?.messages
      ? (countdown.messages[normalizeNickname(partnerNickname)] ?? null)
      : null

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
    ? t.readout.label(
        remainingTime.days,
        remainingTime.hours,
        remainingTime.minutes,
        remainingTime.seconds,
      )
    : t.readout.loading
  const isCountdownLoading =
    viewer === undefined && Boolean(localProfile?.nickname)

  // Syncs the Convex query result (external store) into local cache/profile
  // state. setState here is the intended "subscribe to external system" case.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (viewer?.countdown) {
      storageService.saveCountdownCache(viewer)
      setCachedCountdownState(viewer)
      setPendingCountdownState(null)
    }

    if (viewer?.profile) {
      const nextLocalProfile = {
        nickname: viewer.profile.nickname,
        partnerNickname: viewer.profile.partnerNickname,
      }

      storageService.saveLocalProfile(nextLocalProfile)
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
      setSetupStep(SETUP_STEP.NICKNAME)
      return
    }

    if (viewer === undefined) {
      return
    }

    if (
      !viewer.countdown &&
      !pendingCountdownState?.countdown &&
      !matchingCachedState?.countdown &&
      setupStep === SETUP_STEP.IDLE
    ) {
      setPartnerInput(localProfile.partnerNickname ?? '')
      setSetupStep(
        localProfile.partnerNickname ? SETUP_STEP.DAYS : SETUP_STEP.PARTNER,
      )
    }
  }, [
    localProfile,
    matchingCachedState,
    pendingCountdownState,
    setupStep,
    viewer,
  ])
  /* eslint-enable react-hooks/set-state-in-effect */

  function onNicknameChange(value: string) {
    setNicknameInput(value)
    setFormError('')
  }

  function onPartnerChange(value: string) {
    setPartnerInput(value)
    setFormError('')
  }

  function onDaysChange(value: string) {
    setDaysInput(value)
    setFormError('')
  }

  function onEyebrowChange(value: string) {
    setEyebrowInput(value)
    setFormError('')
  }

  function onTitleChange(value: string) {
    setTitleInput(value)
    setFormError('')
  }

  function onMessageChange(value: string) {
    setMessageInput(value)
    setMessageCopied(false)
    setFormError('')
  }

  async function submitNickname(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const error = nicknameErrorMessage(nicknameInput)

    if (error) {
      setFormError(error)
      return
    }

    const nickname = nicknameInput.trim()

    try {
      setIsSubmitting(true)
      await saveProfile({ nickname })

      const nextProfile = { nickname }
      storageService.saveLocalProfile(nextProfile)
      setLocalProfile(nextProfile)
      setPartnerInput('')
      setSetupStep(SETUP_STEP.PARTNER)
    } catch (error) {
      setFormError(resolveErrorMessage(error, t.errors.saveNickname))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitPartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname) {
      setSetupStep(SETUP_STEP.NICKNAME)
      return
    }

    const error = nicknameErrorMessage(partnerInput)

    if (error) {
      setFormError(error)
      return
    }

    const partnerNickname = partnerInput.trim()

    if (areSameNickname(localProfile.nickname, partnerNickname)) {
      setFormError(t.errors.sameNickname)
      return
    }

    try {
      setIsSubmitting(true)

      const nextProfile = {
        nickname: localProfile.nickname,
        partnerNickname,
      }

      await saveProfile(nextProfile)
      storageService.saveLocalProfile(nextProfile)
      setLocalProfile(nextProfile)

      const partnerState = (await convex.query(api.countdowns.getByNickname, {
        nickname: partnerNickname,
      })) as CountdownState

      if (partnerState.profile && partnerState.countdown) {
        setSyncCandidate(partnerState)
        setSetupStep(SETUP_STEP.SYNC)
        return
      }

      setSetupStep(SETUP_STEP.DAYS)
    } catch (error) {
      setFormError(resolveErrorMessage(error, t.errors.checkNickname))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitSync(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname || !syncCandidate?.profile?.nickname) {
      setSetupStep(SETUP_STEP.PARTNER)
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
      storageService.saveCountdownCache(nextState)
      setCachedCountdownState(nextState)
      storageService.saveLocalProfile(nextProfile)
      setLocalProfile(nextProfile)
      setSetupStep(SETUP_STEP.IDLE)
    } catch (error) {
      setFormError(resolveErrorMessage(error, t.errors.sync))
    } finally {
      setIsSubmitting(false)
    }
  }

  function openMessages() {
    if (!countdown) {
      return
    }

    setFormError('')
    setEyebrowInput(countdown.eyebrow ?? t.defaults.eyebrow)
    setTitleInput(countdown.title ?? t.defaults.title)
    setSetupStep(SETUP_STEP.MESSAGES)
  }

  function openSendMessage() {
    if (!countdown) {
      return
    }

    // Prefill with the message the current user already sent, so they edit it.
    const myNickname = activeProfile?.nickname ?? localProfile?.nickname
    const sent =
      myNickname && countdown.messages
        ? (countdown.messages[normalizeNickname(myNickname)] ?? '')
        : ''

    setFormError('')
    setMessageCopied(false)
    setMessageInput(sent)
    setSetupStep(SETUP_STEP.SEND_MESSAGE)
  }

  async function copyCurrentUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMessageCopied(true)
    } catch {
      setMessageCopied(false)
    }
  }

  async function submitSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname) {
      setSetupStep(SETUP_STEP.NICKNAME)
      return
    }

    try {
      setIsSubmitting(true)
      const nextState = (await sendMessage({
        nickname: localProfile.nickname,
        message: messageInput,
      })) as CountdownState

      setPendingCountdownState(nextState)
      storageService.saveCountdownCache(nextState)
      setCachedCountdownState(nextState)
      setSetupStep(SETUP_STEP.IDLE)
    } catch (error) {
      setFormError(resolveErrorMessage(error, t.errors.sendMessage))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitMessages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname) {
      setSetupStep(SETUP_STEP.NICKNAME)
      return
    }

    try {
      setIsSubmitting(true)
      const nextState = (await updateMessages({
        nickname: localProfile.nickname,
        eyebrow: eyebrowInput,
        title: titleInput,
      })) as CountdownState

      setPendingCountdownState(nextState)
      storageService.saveCountdownCache(nextState)
      setCachedCountdownState(nextState)
      setSetupStep(SETUP_STEP.IDLE)
    } catch (error) {
      setFormError(resolveErrorMessage(error, t.errors.saveMessages))
    } finally {
      setIsSubmitting(false)
    }
  }

  function createOwnCountdown() {
    setSyncCandidate(null)
    setFormError('')
    setSetupStep(SETUP_STEP.DAYS)
  }

  async function submitDays(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!localProfile?.nickname) {
      setSetupStep(SETUP_STEP.NICKNAME)
      return
    }

    const parsedDays = Number(daysInput)

    if (!Number.isInteger(parsedDays) || parsedDays < 0) {
      setFormError(t.errors.invalidDays)
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
      storageService.saveCountdownCache(nextState)
      setCachedCountdownState(nextState)
      setDaysInput('')
      setSetupStep(SETUP_STEP.IDLE)
    } catch (error) {
      setFormError(resolveErrorMessage(error, t.errors.createCountdown))
    } finally {
      setIsSubmitting(false)
    }
  }

  function closeDialog() {
    setFormError('')
    setSetupStep(SETUP_STEP.IDLE)
  }

  const value: CountdownContextValue = {
    localProfile,
    activeProfile,
    countdown,
    isCountdownLoading,
    displayEyebrow,
    displayTitle,
    receivedMessage,
    remainingTime,
    timeReadout,
    timeReadoutLabel,
    progress,
    elapsedDays,
    setupStep,
    setSetupStep,
    formError,
    isSubmitting,
    syncCandidate,
    syncCandidateRemainingDays,
    nicknameInput,
    onNicknameChange,
    partnerInput,
    onPartnerChange,
    daysInput,
    onDaysChange,
    eyebrowInput,
    onEyebrowChange,
    titleInput,
    onTitleChange,
    messageInput,
    onMessageChange,
    messageCopied,
    submitNickname,
    submitPartner,
    submitSync,
    submitDays,
    submitMessages,
    openMessages,
    openSendMessage,
    submitSendMessage,
    copyCurrentUrl,
    createOwnCountdown,
    closeDialog,
  }

  return (
    <CountdownContext.Provider value={value}>
      {children}
    </CountdownContext.Provider>
  )
}
