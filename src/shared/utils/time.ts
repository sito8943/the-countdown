import {
  DAY_IN_MS,
  HOUR_IN_MS,
  MINUTE_IN_MS,
  SECOND_IN_MS,
} from '../constants'
import type { Countdown, DurationParts } from '../models'

export function getRemainingMs(countdown: Countdown | null, now = Date.now()) {
  if (!countdown) {
    return 0
  }

  const totalMs = countdown.initialDays * DAY_IN_MS

  return Math.max(0, totalMs - Math.max(0, now - countdown.placedAt))
}

export function getRemainingDays(countdown: Countdown | null, now = Date.now()) {
  if (!countdown) {
    return null
  }

  const remainingMs = getRemainingMs(countdown, now)

  return remainingMs === 0 ? 0 : Math.ceil(remainingMs / DAY_IN_MS)
}

export function getElapsedDays(countdown: Countdown | null, now = Date.now()) {
  if (!countdown) {
    return 0
  }

  const elapsedMs = Math.max(0, now - countdown.placedAt)

  return Math.min(countdown.initialDays, Math.floor(elapsedMs / DAY_IN_MS))
}

export function getDurationParts(remainingMs: number): DurationParts {
  return {
    days: Math.floor(remainingMs / DAY_IN_MS),
    hours: Math.floor((remainingMs % DAY_IN_MS) / HOUR_IN_MS),
    minutes: Math.floor((remainingMs % HOUR_IN_MS) / MINUTE_IN_MS),
    seconds: Math.floor((remainingMs % MINUTE_IN_MS) / SECOND_IN_MS),
  }
}

export function padTimeUnit(value: number) {
  return value.toString().padStart(2, '0')
}

export function formatPlacedDate(placedAt: number) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(placedAt))
}
