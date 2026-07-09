import { IconButton as SitoIconButton } from '@sito/ui'
import { classNames } from '../../../utils'
import { BUTTON_UI_COLOR, BUTTON_UI_VARIANT, BUTTON_VARIANT } from '../Button'
import { Icon } from '../Icon'
import type { IconButtonProps } from './types'
import './IconButton.css'

/**
 * Icon-only button. Renders a Button with a single Icon and a required
 * accessible label (aria-label), since there is no visible text.
 */
export function IconButton({
  icon,
  label,
  variant = BUTTON_VARIANT.SECONDARY,
  className,
  loading = false,
  disabled,
  ...rest
}: IconButtonProps) {
  const classes = classNames('icon-button', className)

  return (
    <SitoIconButton
      {...rest}
      variant={BUTTON_UI_VARIANT[variant]}
      color={BUTTON_UI_COLOR[variant]}
      className={classes}
      aria-label={label}
      disabled={disabled}
      loading={loading}
      icon={<Icon icon={icon} fixedWidth />}
    />
  )
}
