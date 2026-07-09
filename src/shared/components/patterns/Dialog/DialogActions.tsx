import { DialogActions as SitoDialogActions } from '@sito/ui'
import { classNames } from '../../../utils'
import type { DialogActionsProps } from './types'
import { mapExtraActionClassNames } from './utils'

export function DialogActions({
  containerClassName,
  primaryClassName,
  cancelClassName,
  extraActions,
  ...props
}: DialogActionsProps) {
  return (
    <SitoDialogActions
      {...props}
      containerClassName={classNames('dialog-actions', containerClassName)}
      primaryClassName={classNames(
        'primary-action',
        'dialog-action-primary',
        primaryClassName,
      )}
      cancelClassName={classNames(
        'secondary-action',
        'dialog-action-cancel',
        cancelClassName,
      )}
      extraActions={extraActions?.map(mapExtraActionClassNames)}
    />
  )
}
