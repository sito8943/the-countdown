import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Dialog as SitoDialog } from '@sito/ui'
import { Icon } from '../../elements'
import { classNames } from '../../../utils'
import { DIALOG_EXIT_ANIMATION_MS } from './constants'
import type { DialogProps } from './types'

export function Dialog({
  className,
  closeIcon = <Icon icon={faXmark} fixedWidth />,
  containerClassName,
  exitDurationMs = DIALOG_EXIT_ANIMATION_MS,
  ...props
}: DialogProps) {
  return (
    <SitoDialog
      {...props}
      exitDurationMs={exitDurationMs}
      className={classNames('app-dialog', className)}
      closeIcon={closeIcon}
      containerClassName={classNames('app-dialog-backdrop', containerClassName)}
    />
  )
}
