export const SETUP_STEP = {
  IDLE: 'idle',
  NICKNAME: 'nickname',
  PARTNER: 'partner',
  SYNC: 'sync',
  DAYS: 'days',
  MESSAGES: 'messages',
  SEND_MESSAGE: 'send-message',
} as const

export type SetupStep = (typeof SETUP_STEP)[keyof typeof SETUP_STEP]

export const MESSAGE_MAX_LENGTH = {
  EYEBROW: 60,
  TITLE: 80,
  MESSAGE: 240,
} as const

export const NICKNAME_INPUT_ID = 'nickname'
export const PARTNER_INPUT_ID = 'partner-nickname'
export const DAYS_INPUT_ID = 'initial-days'
export const MESSAGE_EYEBROW_INPUT_ID = 'message-eyebrow'
export const MESSAGE_TITLE_INPUT_ID = 'message-title'
export const PARTNER_MESSAGE_INPUT_ID = 'partner-message'
