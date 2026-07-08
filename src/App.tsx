import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

const STORAGE_KEY = 'the-countdown:cuba-trip'
const DAY_IN_MS = 24 * 60 * 60 * 1000

type CountdownSettings = {
  placedAt: string
  initialDays: number
}

function getStartOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function getDaysElapsed(placedAt: string, today = new Date()) {
  const placedDate = new Date(placedAt)

  if (Number.isNaN(placedDate.getTime())) {
    return 0
  }

  const start = getStartOfDay(placedDate).getTime()
  const current = getStartOfDay(today).getTime()

  return Math.max(0, Math.floor((current - start) / DAY_IN_MS))
}

function getRemainingDays(settings: CountdownSettings | null) {
  if (!settings) {
    return null
  }

  return Math.max(0, settings.initialDays - getDaysElapsed(settings.placedAt))
}

function readCountdownSettings(): CountdownSettings | null {
  const rawValue = window.localStorage.getItem(STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<CountdownSettings>

    if (
      typeof parsedValue.placedAt !== 'string' ||
      Number.isNaN(new Date(parsedValue.placedAt).getTime()) ||
      typeof parsedValue.initialDays !== 'number' ||
      !Number.isFinite(parsedValue.initialDays) ||
      parsedValue.initialDays < 0
    ) {
      return null
    }

    return {
      placedAt: parsedValue.placedAt,
      initialDays: Math.floor(parsedValue.initialDays),
    }
  } catch {
    return null
  }
}

function saveCountdownSettings(initialDays: number) {
  const nextSettings: CountdownSettings = {
    placedAt: new Date().toISOString(),
    initialDays,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings))

  return nextSettings
}

function formatPlacedDate(placedAt: string) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(placedAt))
}

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [settings, setSettings] = useState<CountdownSettings | null>(() =>
    readCountdownSettings(),
  )
  const [daysInput, setDaysInput] = useState('')
  const [inputError, setInputError] = useState('')

  const remainingDays = useMemo(() => getRemainingDays(settings), [settings])
  const elapsedDays = useMemo(
    () => (settings ? getDaysElapsed(settings.placedAt) : 0),
    [settings],
  )
  const progress = useMemo(() => {
    if (!settings) {
      return 0
    }

    if (settings.initialDays === 0) {
      return 100
    }

    return Math.min(100, Math.round((elapsedDays / settings.initialDays) * 100))
  }, [elapsedDays, settings])

  useEffect(() => {
    const dialog = dialogRef.current

    if (!settings && dialog && !dialog.open) {
      dialog.showModal()
    }
  }, [settings])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsedDays = Number(daysInput)

    if (!Number.isInteger(parsedDays) || parsedDays < 0) {
      setInputError('Escribe un numero entero de dias.')
      return
    }

    const nextSettings = saveCountdownSettings(parsedDays)
    setSettings(nextSettings)
    setDaysInput('')
    setInputError('')
    dialogRef.current?.close()
  }

  function handleEdit() {
    setDaysInput(settings?.initialDays.toString() ?? '')
    setInputError('')
    dialogRef.current?.showModal()
  }

  return (
    <main className="countdown-shell">
      <section className="countdown-hero" aria-labelledby="countdown-title">
        <div className="hero-copy">
          <p className="eyebrow">Cuba esta cerca</p>
          <h1 id="countdown-title">Nuestro countdown</h1>
          <p className="intro">
            Un contador simple para ver como avanza el camino hasta volver a
            estar juntos.
          </p>
        </div>

        <img
          src={heroImg}
          className="hero-image"
          width="170"
          height="179"
          alt=""
        />
      </section>

      <section className="countdown-card" aria-live="polite">
        <div className="days-block">
          <span className="days-value">{remainingDays ?? '-'}</span>
          <span className="days-label">
            {remainingDays === 1 ? 'dia restante' : 'dias restantes'}
          </span>
        </div>

        <div className="progress-block">
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-meta">
            <span>{progress}% recorrido</span>
            <span>
              {settings
                ? `${elapsedDays} de ${settings.initialDays} dias`
                : 'Esperando el numero inicial'}
            </span>
          </div>
        </div>

        {settings ? (
          <div className="settings-summary">
            <p>
              Numero colocado el {formatPlacedDate(settings.placedAt)}. La app
              recalcula los dias usando la fecha actual cada vez que se abre.
            </p>
            <button type="button" className="secondary-action" onClick={handleEdit}>
              Cambiar numero
            </button>
          </div>
        ) : null}
      </section>

      <dialog
        ref={dialogRef}
        className="setup-dialog"
        onCancel={(event) => {
          if (!settings) {
            event.preventDefault()
          }
        }}
      >
        <form method="dialog" className="setup-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Primer inicio</p>
            <h2>Cuantos dias faltan?</h2>
            <p>
              Guarda el numero actual y desde manana se va descontando segun el
              dia.
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
              setInputError('')
            }}
            autoFocus
          />
          {inputError ? <p className="field-error">{inputError}</p> : null}

          <button type="submit" className="primary-action">
            Guardar countdown
          </button>
        </form>
      </dialog>
    </main>
  )
}

export default App
