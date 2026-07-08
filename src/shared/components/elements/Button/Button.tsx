import { classNames } from '../../../utils'
import { BUTTON_VARIANT, BUTTON_VARIANT_CLASS } from './constants'
import type { ButtonProps } from './types'

/**
 * The only <button> in the app. Everything else renders Button or IconButton.
 * Defaults to type="button" so a bare button never accidentally submits a form;
 * pass type="submit" explicitly for submit actions.
 */
export function Button({
  variant = BUTTON_VARIANT.PRIMARY,
  type = 'button',
  className,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const classes = classNames(
    BUTTON_VARIANT_CLASS[variant],
    loading ? 'is-loading' : undefined,
    className,
  )

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="button-spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  )
}
