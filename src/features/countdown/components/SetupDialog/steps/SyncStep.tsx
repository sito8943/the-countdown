import { t } from '../../../../../lang'
import {
  Button,
  BUTTON_VARIANT,
} from '../../../../../shared/components/elements'
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
        <Button
          type="button"
          variant={BUTTON_VARIANT.SECONDARY}
          onClick={createOwnCountdown}
          disabled={isSubmitting}
        >
          {t.setup.sync.createOwn}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {t.setup.sync.submit}
        </Button>
      </div>
    </form>
  )
}
