import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant } from './constants'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  // Shows a spinner and disables the button while an action is in flight.
  loading?: boolean
}
