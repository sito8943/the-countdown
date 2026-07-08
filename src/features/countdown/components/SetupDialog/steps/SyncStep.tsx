import { t } from '../../../../../lang'
import { useCountdown } from '../../../providers/CountdownProvider'

export function SyncStep() {
  const {
    syncCandidate,
    syncCandidateRemainingDays,
    submitSync,
    createOwnCountdown,
    formError,
    isSubmitting,
  } = useCountdown()

  return (
    <form className="setup-form" onSubmit={submitSync}>
      <div>
        <p className="eyebrow">{t.setup.sync.eyebrow}</p>
        <h2>{t.setup.sync.title}</h2>
        <p>
          {t.setup.sync.description(
            syncCandidate?.profile?.nickname ?? '',
            syncCandidateRemainingDays,
          )}
        </p>
      </div>

      {formError ? <p className="field-error">{formError}</p> : null}

      <div className="dialog-actions">
        <button
          type="button"
          className="secondary-action"
          onClick={createOwnCountdown}
          disabled={isSubmitting}
        >
          {t.setup.sync.createOwn}
        </button>
        <button
          type="submit"
          className="primary-action"
          disabled={isSubmitting}
        >
          {t.setup.sync.submit}
        </button>
      </div>
    </form>
  )
}
