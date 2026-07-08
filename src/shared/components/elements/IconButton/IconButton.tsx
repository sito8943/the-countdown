import { classNames } from '../../../utils'
import { Button, BUTTON_VARIANT } from '../Button'
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
  ...rest
}: IconButtonProps) {
  const classes = classNames('icon-button', className)

  return (
    <Button
      variant={variant}
      className={classes}
      aria-label={label}
      loading={loading}
      {...rest}
    >
      {/* While loading the Button renders its spinner; hide the icon so only
          the spinner shows. */}
      {loading ? null : <Icon icon={icon} fixedWidth />}
    </Button>
  )
}
