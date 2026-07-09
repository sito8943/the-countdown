import { t } from '../../../../../lang'
import { TextInput } from '../../../../../shared/components/elements'
import { DialogActions } from '../../../../../shared/components/patterns'
import { NICKNAME_MAX_LENGTH } from '../../../../../shared/constants'
import {
  DAYS_INPUT_ID,
  MESSAGE_EYEBROW_INPUT_ID,
  MESSAGE_MAX_LENGTH,
  MESSAGE_TITLE_INPUT_ID,
  NICKNAME_INPUT_ID,
  PARTNER_INPUT_ID,
} from '../../../constants'
import { useCountdown } from '../../../providers/CountdownProvider'

export function MessagesStep() {
  const {
    nicknameInput,
    onNicknameChange,
    partnerInput,
    onPartnerChange,
    daysInput,
    onDaysChange,
    eyebrowInput,
    onEyebrowChange,
    titleInput,
    onTitleChange,
    submitMessages,
    closeDialog,
    formError,
    isSubmitting,
  } = useCountdown()

  return (
    <form className="setup-form" onSubmit={submitMessages}>
      <div>
        <p className="eyebrow">{t.setup.messages.eyebrow}</p>
        <h2>{t.setup.messages.title}</h2>
      </div>

      <label htmlFor={NICKNAME_INPUT_ID}>
        {t.setup.messages.nicknameLabel}
      </label>
      <TextInput
        id={NICKNAME_INPUT_ID}
        maxLength={NICKNAME_MAX_LENGTH}
        placeholder={t.setup.messages.nicknameLabel}
        value={nicknameInput}
        onChange={(event) => onNicknameChange(event.target.value)}
        autoFocus
      />

      <label htmlFor={PARTNER_INPUT_ID}>{t.setup.messages.partnerLabel}</label>
      <TextInput
        id={PARTNER_INPUT_ID}
        maxLength={NICKNAME_MAX_LENGTH}
        placeholder={t.setup.messages.partnerLabel}
        value={partnerInput}
        onChange={(event) => onPartnerChange(event.target.value)}
      />

      <label htmlFor={DAYS_INPUT_ID}>{t.setup.messages.durationLabel}</label>
      <TextInput
        id={DAYS_INPUT_ID}
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        value={daysInput}
        onChange={(event) => onDaysChange(event.target.value)}
      />

      <label htmlFor={MESSAGE_EYEBROW_INPUT_ID}>
        {t.setup.messages.eyebrowLabel}
      </label>
      <TextInput
        id={MESSAGE_EYEBROW_INPUT_ID}
        maxLength={MESSAGE_MAX_LENGTH.EYEBROW}
        placeholder={t.defaults.eyebrow}
        value={eyebrowInput}
        onChange={(event) => onEyebrowChange(event.target.value)}
      />

      <label htmlFor={MESSAGE_TITLE_INPUT_ID}>
        {t.setup.messages.titleLabel}
      </label>
      <TextInput
        id={MESSAGE_TITLE_INPUT_ID}
        maxLength={MESSAGE_MAX_LENGTH.TITLE}
        placeholder={t.defaults.title}
        value={titleInput}
        onChange={(event) => onTitleChange(event.target.value)}
      />

      {formError ? <p className="field-error">{formError}</p> : null}

      <DialogActions
        primaryText={t.setup.messages.submit}
        cancelText={t.setup.messages.cancel}
        onCancel={closeDialog}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  )
}
