import { classNames } from '../../../utils'
import type { TextareaProps } from './types'

/**
 * The only <textarea> in the app. Applies the shared `.field` styling plus
 * the `.field--area` modifier (taller, vertically resizable).
 */
export function Textarea({ className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={classNames('field', 'field--area', className)}
      {...rest}
    />
  )
}
