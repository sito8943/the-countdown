import type {
  ButtonColor as SitoButtonColor,
  ButtonVariant as SitoButtonVariant,
} from '@sito/ui'

export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT]

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  [BUTTON_VARIANT.PRIMARY]: 'primary-action',
  [BUTTON_VARIANT.SECONDARY]: 'secondary-action',
}

export const BUTTON_UI_VARIANT: Record<ButtonVariant, SitoButtonVariant> = {
  [BUTTON_VARIANT.PRIMARY]: 'submit',
  [BUTTON_VARIANT.SECONDARY]: 'text',
}

export const BUTTON_UI_COLOR: Record<ButtonVariant, SitoButtonColor> = {
  [BUTTON_VARIANT.PRIMARY]: 'primary',
  [BUTTON_VARIANT.SECONDARY]: 'default',
}
