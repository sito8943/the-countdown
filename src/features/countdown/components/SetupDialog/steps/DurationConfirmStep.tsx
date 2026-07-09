import { t } from '../../../../../lang'
import { DialogActions } from '../../../../../shared/components/patterns'
import { useCountdown } from '../../../providers/CountdownProvider'

export function DurationConfirmStep() {
  const { confirmDuration, formError, isSubmitting } = useCountdown()

  return (
    <div className="setup-form">
      <div>
        <p className="eyebrow">{t.setup.confirmDuration.eyebrow}</p>
        <h2>{t.setup.confirmDuration.title}</h2>
        <p>{t.setup.confirmDuration.description}</p>
      </div>

      {formError ? <p className="field-error">{formError}</p> : null}

      <DialogActions
        primaryType="button"
        primaryText={t.setup.confirmDuration.reset}
        cancelText={t.setup.confirmDuration.keep}
        onPrimaryClick={() => confirmDuration(true)}
        onCancel={() => confirmDuration(false)}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      />
    </div>
  )
}
