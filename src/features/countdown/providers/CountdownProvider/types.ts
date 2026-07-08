import type { FormEvent } from 'react'
import type {
  Countdown,
  CountdownProfile,
  CountdownState,
  DurationParts,
  LocalProfile,
} from '../../../../shared/models'
import type { SetupStep } from '../../constants'

export type TimeReadout = {
  days: string
  hours: string
  minutes: string
  seconds: string
}

export type CountdownContextValue = {
  // Domain state
  localProfile: LocalProfile | null
  activeProfile: CountdownProfile | null
  countdown: Countdown | null
  isCountdownLoading: boolean

  // Display copy (custom message or default)
  displayEyebrow: string
  displayTitle: string
  // Message received from the partner (null when none yet)
  receivedMessage: string | null

  // Derived time values
  remainingTime: DurationParts | null
  timeReadout: TimeReadout
  timeReadoutLabel: string
  progress: number
  elapsedDays: number

  // Setup flow
  setupStep: SetupStep
  setSetupStep: (step: SetupStep) => void
  formError: string
  isSubmitting: boolean
  syncCandidate: CountdownState | null
  syncCandidateRemainingDays: number | null

  // Inputs
  nicknameInput: string
  onNicknameChange: (value: string) => void
  partnerInput: string
  onPartnerChange: (value: string) => void
  daysInput: string
  onDaysChange: (value: string) => void
  eyebrowInput: string
  onEyebrowChange: (value: string) => void
  titleInput: string
  onTitleChange: (value: string) => void
  messageInput: string
  onMessageChange: (value: string) => void
  messageCopied: boolean

  // Actions
  submitNickname: (event: FormEvent<HTMLFormElement>) => void
  submitPartner: (event: FormEvent<HTMLFormElement>) => void
  submitSync: (event: FormEvent<HTMLFormElement>) => void
  submitDays: (event: FormEvent<HTMLFormElement>) => void
  submitMessages: (event: FormEvent<HTMLFormElement>) => void
  confirmDuration: (resetProgress: boolean) => void
  openMessages: () => void
  openSendMessage: () => void
  submitSendMessage: (event: FormEvent<HTMLFormElement>) => void
  copyCurrentUrl: () => void
  createOwnCountdown: () => void
  closeDialog: () => void
}
