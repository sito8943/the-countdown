import { classNames } from '../../../utils'
import type { TextInputProps } from './types'

/**
 * The only <input> in the app. Applies the shared `.field` styling.
 * Defaults to type="text"; pass type for number/email/etc.
 */
export function TextInput({
  type = 'text',
  className,
  ...rest
}: TextInputProps) {
  return (
    <input type={type} className={classNames('field', className)} {...rest} />
  )
}
