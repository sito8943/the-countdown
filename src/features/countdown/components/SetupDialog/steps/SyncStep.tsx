import { t } from '../../../../../lang'
import { DialogActions } from '../../../../../shared/components/patterns'
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

      <DialogActions
        primaryText={t.setup.sync.submit}
        cancelText={t.setup.sync.createOwn}
        onCancel={createOwnCountdown}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  )
}
