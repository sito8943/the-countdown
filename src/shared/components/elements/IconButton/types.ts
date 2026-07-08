import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { ButtonProps } from '../Button'

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  icon: IconProp
  /** Accessible name — required because the button has no visible text. */
  label: string
}
