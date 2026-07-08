import { t } from '../../../../../lang'
import { DAYS_INPUT_ID } from '../../../constants'
import { useCountdown } from '../../../providers/CountdownProvider'

export function DaysStep() {
  const { daysInput, onDaysChange, submitDays, formError, isSubmitting } =
    useCountdown()

  return (
    <form className="setup-form" onSubmit={submitDays}>
      <div>
        <p className="eyebrow">{t.setup.days.eyebrow}</p>
        <h2>{t.setup.days.title}</h2>
        <p>{t.setup.days.description}</p>
      </div>

      <label htmlFor={DAYS_INPUT_ID}>{t.setup.days.label}</label>
      <input
        id={DAYS_INPUT_ID}
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        value={daysInput}
        onChange={(event) => onDaysChange(event.target.value)}
        autoFocus
      />

      {formError ? <p className="field-error">{formError}</p> : null}

      <button type="submit" className="primary-action" disabled={isSubmitting}>
        {t.setup.days.submit}
      </button>
    </form>
  )
}
