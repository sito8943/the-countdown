import { t } from '../../../../lang'
import { formatPlacedDate } from '../../../../shared/utils'
import { useCountdown } from '../../providers/CountdownProvider'
import { TimeScale } from '../TimeScale'
import './CountdownCard.css'

export function CountdownCard() {
  const {
    activeProfile,
    localProfile,
    countdown,
    displayNote,
    progress,
    elapsedDays,
    isCountdownLoading,
    openMessages,
  } = useCountdown()

  return (
    <section className="countdown-card" aria-live="polite">
      <div className="profile-row">
        <span className="status-pill">
          {activeProfile?.nickname ?? localProfile?.nickname ?? t.profile.empty}
        </span>
        {activeProfile?.partnerNickname ? (
          <span className="status-pill muted-pill">
            {t.profile.with(activeProfile.partnerNickname)}
          </span>
        ) : null}
      </div>

      <div className="countdown-readout">
        <TimeScale />
        <p className="readout-caption">{t.readout.caption}</p>
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

      {countdown ? (
        <div className="settings-summary">
          <p>
            {t.summary.createdBy(
              countdown.ownerNickname,
              formatPlacedDate(countdown.placedAt),
            )}{' '}
            {displayNote}
          </p>
          <button
            type="button"
            className="secondary-action"
            onClick={openMessages}
          >
            {t.summary.editMessages}
          </button>
        </div>
      ) : (
        <p className="loading-copy">
          {isCountdownLoading ? t.loading.shared : t.loading.completeSteps}
        </p>
      )}
    </section>
  )
}
