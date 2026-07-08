import { faPaperPlane, faPen } from '@fortawesome/free-solid-svg-icons'
import { t } from '../../../../lang'
import {
  BUTTON_VARIANT,
  IconButton,
} from '../../../../shared/components/elements'
import { useCountdown } from '../../providers/CountdownProvider'
import './CountdownFabs.css'

// Rendered at screen level (not inside the animated card) so the fixed
// positioning stays relative to the viewport. A transform on any ancestor
// would turn that ancestor into the containing block and break the FABs.
export function CountdownFabs() {
  const { countdown, openMessages, openSendMessage } = useCountdown()

  if (!countdown) {
    return null
  }

  return (
    <div className="fab-stack">
      <IconButton
        className="edit-fab"
        variant={BUTTON_VARIANT.SECONDARY}
        icon={faPen}
        label={t.summary.editMessages}
        onClick={openMessages}
      />
      <IconButton
        className="send-fab"
        variant={BUTTON_VARIANT.PRIMARY}
        icon={faPaperPlane}
        label={t.summary.sendMessage}
        onClick={openSendMessage}
      />
    </div>
  )
}
