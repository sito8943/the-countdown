import { t } from '../../../../../lang'
import { PARTNER_INPUT_ID } from '../../../constants'
import { useCountdown } from '../../../providers/CountdownProvider'

export function PartnerStep() {
  const {
    partnerInput,
    onPartnerChange,
    submitPartner,
    formError,
    isSubmitting,
  } = useCountdown()

  return (
    <form className="setup-form" onSubmit={submitPartner}>
      <div>
        <p className="eyebrow">{t.setup.partner.eyebrow}</p>
        <h2>{t.setup.partner.title}</h2>
        <p>{t.setup.partner.description}</p>
      </div>

      <label htmlFor={PARTNER_INPUT_ID}>{t.setup.partner.label}</label>
      <input
        id={PARTNER_INPUT_ID}
        type="text"
        value={partnerInput}
        onChange={(event) => onPartnerChange(event.target.value)}
        autoFocus
      />

      {formError ? <p className="field-error">{formError}</p> : null}

      <button type="submit" className="primary-action" disabled={isSubmitting}>
        {t.setup.partner.submit}
      </button>
    </form>
  )
}
