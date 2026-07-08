import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from '../constants'

export const NICKNAME_ERROR = {
  TOO_SHORT: 'too_short',
  TOO_LONG: 'too_long',
} as const

export type NicknameError = (typeof NICKNAME_ERROR)[keyof typeof NICKNAME_ERROR]

export function cleanNickname(nickname: string) {
  return nickname.trim()
}

export function normalizeNickname(nickname: string) {
  return cleanNickname(nickname).toLowerCase()
}

export function areSameNickname(first: string, second: string) {
  return normalizeNickname(first) === normalizeNickname(second)
}

export function getNicknameError(nickname: string): NicknameError | null {
  const cleanValue = cleanNickname(nickname)

  if (cleanValue.length < NICKNAME_MIN_LENGTH) {
    return NICKNAME_ERROR.TOO_SHORT
  }

  if (cleanValue.length > NICKNAME_MAX_LENGTH) {
    return NICKNAME_ERROR.TOO_LONG
  }

  return null
}
