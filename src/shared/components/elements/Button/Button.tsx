import { Button as SitoButton } from '@sito/ui'
import { classNames } from '../../../utils'
import {
  BUTTON_UI_COLOR,
  BUTTON_UI_VARIANT,
  BUTTON_VARIANT,
  BUTTON_VARIANT_CLASS,
} from './constants'
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
  const classes = classNames(BUTTON_VARIANT_CLASS[variant], className)

  return (
    <SitoButton
      {...rest}
      type={type}
      variant={BUTTON_UI_VARIANT[variant]}
      color={BUTTON_UI_COLOR[variant]}
      className={classes}
      disabled={disabled}
      loading={loading}
    >
      {children}
    </SitoButton>
  )
}
