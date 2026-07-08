import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef } from 'react'
import { t } from '../../../../lang'
import {
  BUTTON_VARIANT,
  IconButton,
} from '../../../../shared/components/elements'
import { SETUP_STEP } from '../../constants'
import { useCountdown } from '../../providers/CountdownProvider'
import { DaysStep } from './steps/DaysStep'
import { MessagesStep } from './steps/MessagesStep'
import { NicknameStep } from './steps/NicknameStep'
import { PartnerStep } from './steps/PartnerStep'
import { SendMessageStep } from './steps/SendMessageStep'
import { SyncStep } from './steps/SyncStep'
import type { SetupStep } from '../../constants'
import './SetupDialog.css'

function renderStep(setupStep: SetupStep) {
  switch (setupStep) {
    case SETUP_STEP.NICKNAME:
      return <NicknameStep />
    case SETUP_STEP.PARTNER:
      return <PartnerStep />
    case SETUP_STEP.SYNC:
      return <SyncStep />
    case SETUP_STEP.DAYS:
      return <DaysStep />
    case SETUP_STEP.MESSAGES:
      return <MessagesStep />
    case SETUP_STEP.SEND_MESSAGE:
      return <SendMessageStep />
    default:
      return null
  }
}

export function SetupDialog() {
  const { setupStep, closeDialog } = useCountdown()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isDismissible =
    setupStep === SETUP_STEP.MESSAGES || setupStep === SETUP_STEP.SEND_MESSAGE

  // This component is mounted lazily only while a setup step is active
  // (see CountdownScreen), so open the modal once on mount. Closing happens
  // by unmounting when the step returns to idle.
  useEffect(() => {
    const dialog = dialogRef.current

    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="setup-dialog"
      onCancel={(event) => {
        if (
          setupStep === SETUP_STEP.MESSAGES ||
          setupStep === SETUP_STEP.SEND_MESSAGE
        ) {
          closeDialog()
          return
        }

        if (setupStep !== SETUP_STEP.IDLE) {
          event.preventDefault()
        }
      }}
    >
      {isDismissible ? (
        <IconButton
          className="dialog-close"
          variant={BUTTON_VARIANT.SECONDARY}
          icon={faXmark}
          label={t.setup.close}
          onClick={closeDialog}
        />
      ) : null}
      {renderStep(setupStep)}
    </dialog>
  )
}
