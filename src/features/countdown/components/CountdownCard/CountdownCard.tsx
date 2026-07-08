import { faPaperPlane, faPen } from '@fortawesome/free-solid-svg-icons'
import { t } from '../../../../lang'
import {
  BUTTON_VARIANT,
  IconButton,
} from '../../../../shared/components/elements'
import { useCountdown } from '../../providers/CountdownProvider'
import { TimeScale } from '../TimeScale'
import './CountdownCard.css'

export function CountdownCard() {
  const {
    activeProfile,
    localProfile,
    countdown,
    receivedMessage,
    progress,
    elapsedDays,
    isCountdownLoading,
    openMessages,
    openSendMessage,
  } = useCountdown()

  const partnerNickname = activeProfile?.partnerNickname

  return (
    <section className="countdown-card" aria-live="polite">
      <div className="countdown-readout">
        <TimeScale />
      </div>

      <div className="progress-block">
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-meta">
          <span>{t.progress.percent(progress)}</span>
          <span>
            {countdown
              ? t.progress.elapsed(elapsedDays, countdown.initialDays)
              : localProfile?.nickname
                ? t.progress.waitingSetup
                : t.progress.waitingNickname}
          </span>
        </div>
      </div>

      <div className="profile-row">
        <p className="status-pill">
          {activeProfile?.nickname ?? localProfile?.nickname ?? t.profile.empty}{' '}
          {activeProfile?.partnerNickname
            ? t.profile.with(activeProfile.partnerNickname)
            : null}
        </p>
      </div>

      {countdown ? (
        <div className="settings-summary">
          {receivedMessage ? (
            <p>
              {partnerNickname ? (
                <span className="message-from">
                  {t.summary.messageFrom(partnerNickname)}
                </span>
              ) : null}
              {receivedMessage}
            </p>
          ) : (
            <p className="message-empty">{t.summary.noMessage}</p>
          )}

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
        </div>
      ) : (
        <p className="loading-copy">
          {isCountdownLoading ? t.loading.shared : t.loading.completeSteps}
        </p>
      )}
    </section>
  )
}
