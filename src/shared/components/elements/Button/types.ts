import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant } from './constants'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}
