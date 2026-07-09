import type { DialogActionButtonProps } from '@sito/ui'
import { classNames } from '../../../utils'

export function mapExtraActionClassNames(
  action: DialogActionButtonProps,
): DialogActionButtonProps {
  return {
    ...action,
    className: classNames(
      'secondary-action',
      'dialog-action-extra',
      action.className,
    ),
  }
}
