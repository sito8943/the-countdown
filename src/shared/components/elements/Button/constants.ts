export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT]

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  [BUTTON_VARIANT.PRIMARY]: 'primary-action',
  [BUTTON_VARIANT.SECONDARY]: 'secondary-action',
}
