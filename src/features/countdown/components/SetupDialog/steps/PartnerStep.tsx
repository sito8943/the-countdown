import { t } from '../../../../../lang'
import { Button, TextInput } from '../../../../../shared/components/elements'
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
      <TextInput
        id={PARTNER_INPUT_ID}
        value={partnerInput}
        onChange={(event) => onPartnerChange(event.target.value)}
        autoFocus
      />

      {formError ? <p className="field-error">{formError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {t.setup.partner.submit}
      </Button>
    </form>
  )
}
