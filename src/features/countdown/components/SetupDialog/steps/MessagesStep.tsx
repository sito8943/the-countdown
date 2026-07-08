import { t } from '../../../../../lang'
import {
  Button,
  BUTTON_VARIANT,
  TextInput,
  Textarea,
} from '../../../../../shared/components/elements'
import {
  MESSAGE_EYEBROW_INPUT_ID,
  MESSAGE_MAX_LENGTH,
  MESSAGE_NOTE_INPUT_ID,
  MESSAGE_TITLE_INPUT_ID,
} from '../../../constants'
import { useCountdown } from '../../../providers/CountdownProvider'

export function MessagesStep() {
  const {
    eyebrowInput,
    onEyebrowChange,
    titleInput,
    onTitleChange,
    noteInput,
    onNoteChange,
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

      <label htmlFor={MESSAGE_EYEBROW_INPUT_ID}>
        {t.setup.messages.eyebrowLabel}
      </label>
      <TextInput
        id={MESSAGE_EYEBROW_INPUT_ID}
        maxLength={MESSAGE_MAX_LENGTH.EYEBROW}
        placeholder={t.defaults.eyebrow}
        value={eyebrowInput}
        onChange={(event) => onEyebrowChange(event.target.value)}
        autoFocus
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

      <label htmlFor={MESSAGE_NOTE_INPUT_ID}>
        {t.setup.messages.noteLabel}
      </label>
      <Textarea
        id={MESSAGE_NOTE_INPUT_ID}
        rows={3}
        maxLength={MESSAGE_MAX_LENGTH.NOTE}
        placeholder={t.defaults.note}
        value={noteInput}
        onChange={(event) => onNoteChange(event.target.value)}
      />

      {formError ? <p className="field-error">{formError}</p> : null}

      <div className="dialog-actions">
        <Button
          type="button"
          variant={BUTTON_VARIANT.SECONDARY}
          onClick={closeDialog}
          disabled={isSubmitting}
        >
          {t.setup.messages.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {t.setup.messages.submit}
        </Button>
      </div>
    </form>
  )
}
