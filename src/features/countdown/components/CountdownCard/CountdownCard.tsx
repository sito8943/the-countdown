import { t } from '../../../../lang'
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
  } = useCountdown()

  const partnerNickname = activeProfile?.partnerNickname

  return (
    <section className="countdown-card enter-up" aria-live="polite">
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
        </div>
      ) : (
        <p className="loading-copy">
          {isCountdownLoading ? t.loading.shared : t.loading.completeSteps}
        </p>
      )}
    </section>
  )
}
