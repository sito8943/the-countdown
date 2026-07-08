import { COUNTDOWN_CACHE_STORAGE_KEY, PROFILE_STORAGE_KEY } from '../constants'
import type { CountdownState, LocalProfile } from '../models'

/**
 * Encapsulates every localStorage side effect for the countdown domain:
 * reading/writing the local profile and validating the cached countdown state.
 * Instantiated once and exposed through the app providers (see ARCHITECTURE_RULES §4).
 */
export class StorageService {
  readLocalProfile(): LocalProfile | null {
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

  saveLocalProfile(profile: LocalProfile) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  }

  readCachedCountdownState(): CountdownState | null {
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
          eyebrow:
            typeof countdown.eyebrow === 'string'
              ? countdown.eyebrow
              : undefined,
          title:
            typeof countdown.title === 'string' ? countdown.title : undefined,
          note: typeof countdown.note === 'string' ? countdown.note : undefined,
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

  saveCountdownCache(state: CountdownState) {
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

  getInitialLocalProfile(): LocalProfile | null {
    return (
      this.readLocalProfile() ??
      this.readCachedCountdownState()?.profile ??
      null
    )
  }
}

export const storageService = new StorageService()
