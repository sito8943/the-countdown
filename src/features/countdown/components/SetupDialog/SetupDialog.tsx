import { useEffect, useRef } from 'react'
import { SETUP_STEP } from '../../constants'
import { useCountdown } from '../../providers/CountdownProvider'
import { DaysStep } from './steps/DaysStep'
import { MessagesStep } from './steps/MessagesStep'
import { NicknameStep } from './steps/NicknameStep'
import { PartnerStep } from './steps/PartnerStep'
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
    default:
      return null
  }
}

export function SetupDialog() {
  const { setupStep, closeDialog } = useCountdown()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (setupStep === SETUP_STEP.IDLE) {
      if (dialog.open) {
        dialog.close()
      }
      return
    }

    if (!dialog.open) {
      dialog.showModal()
    }
  }, [setupStep])

  return (
    <dialog
      ref={dialogRef}
      className="setup-dialog"
      onCancel={(event) => {
        if (setupStep === SETUP_STEP.MESSAGES) {
          closeDialog()
          return
        }

        if (setupStep !== SETUP_STEP.IDLE) {
          event.preventDefault()
        }
      }}
    >
      {renderStep(setupStep)}
    </dialog>
  )
}
