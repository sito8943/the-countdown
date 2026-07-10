import type { DialogProps as SitoDialogProps } from '@sito/ui'

export type {
  DialogActionButtonProps,
  DialogActionsProps,
  DialogInitialFocus,
  DialogState,
  DialogSubmitHandler,
  UseDialogReturn,
} from '@sito/ui'

export type DialogExitCompleteHandler = NonNullable<
  SitoDialogProps['onExitComplete']
>

export type DialogProps = SitoDialogProps
