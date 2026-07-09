import { t } from '../../../../lang'
import { Dialog } from '../../../../shared/components/patterns'
import { SETUP_STEP, type SetupStep } from '../../constants'
import { useCountdown } from '../../providers/CountdownProvider'
import { DaysStep } from './steps/DaysStep'
import { DurationConfirmStep } from './steps/DurationConfirmStep'
import { MessagesStep } from './steps/MessagesStep'
import { NicknameStep } from './steps/NicknameStep'
import { PartnerStep } from './steps/PartnerStep'
import { SendMessageStep } from './steps/SendMessageStep'
import { SyncStep } from './steps/SyncStep'
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
    case SETUP_STEP.CONFIRM_DURATION:
      return <DurationConfirmStep />
    default:
      return null
  }
}

function getSetupDialogLabel(setupStep: SetupStep) {
  switch (setupStep) {
    case SETUP_STEP.NICKNAME:
      return t.setup.nickname.title
    case SETUP_STEP.PARTNER:
      return t.setup.partner.title
    case SETUP_STEP.SYNC:
      return t.setup.sync.title
    case SETUP_STEP.DAYS:
      return t.setup.days.title
    case SETUP_STEP.MESSAGES:
      return t.setup.messages.title
    case SETUP_STEP.SEND_MESSAGE:
      return t.setup.sendMessage.title
    case SETUP_STEP.CONFIRM_DURATION:
      return t.setup.confirmDuration.title
    default:
      return t.loading.completeSteps
  }
}

export function SetupDialog() {
  const { setupStep, closeDialog } = useCountdown()
  const isDismissible =
    setupStep === SETUP_STEP.MESSAGES ||
    setupStep === SETUP_STEP.SEND_MESSAGE ||
    setupStep === SETUP_STEP.CONFIRM_DURATION

  return (
    <Dialog
      open={setupStep !== SETUP_STEP.IDLE}
      ariaLabel={getSetupDialogLabel(setupStep)}
      onClose={closeDialog}
      initialFocus="first-input"
      closeOnEscape={isDismissible}
      closeOnBackdropClick={false}
      showCloseButton={isDismissible}
      closeLabel={t.setup.close}
      containerClassName="setup-dialog-backdrop"
      className="setup-dialog"
    >
      {renderStep(setupStep)}
    </Dialog>
  )
}
