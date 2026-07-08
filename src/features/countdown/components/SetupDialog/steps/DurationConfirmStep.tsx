import { t } from '../../../../../lang'
import {
  Button,
  BUTTON_VARIANT,
} from '../../../../../shared/components/elements'
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

      <div className="dialog-actions">
        <Button
          type="button"
          variant={BUTTON_VARIANT.SECONDARY}
          onClick={() => confirmDuration(false)}
          disabled={isSubmitting}
        >
          {t.setup.confirmDuration.keep}
        </Button>
        <Button
          type="button"
          onClick={() => confirmDuration(true)}
          loading={isSubmitting}
        >
          {t.setup.confirmDuration.reset}
        </Button>
      </div>
    </div>
  )
}
