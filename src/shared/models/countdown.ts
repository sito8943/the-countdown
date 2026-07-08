export type LocalProfile = {
  nickname: string
  partnerNickname?: string
}

export type Countdown = {
  initialDays: number
  placedAt: number
  ownerNickname: string
  eyebrow?: string
  title?: string
  note?: string
  messages?: Record<string, string>
  createdAt?: number
  updatedAt?: number
}

export type CountdownProfile = {
  nickname: string
  partnerNickname?: string
}

export type CountdownState = {
  profile: CountdownProfile | null
  countdown: Countdown | null
}

export type DurationParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}
