import { t } from '../../../../../lang'
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
        <p>{t.setup.messages.description}</p>
      </div>

      <label htmlFor={MESSAGE_EYEBROW_INPUT_ID}>
        {t.setup.messages.eyebrowLabel}
      </label>
      <input
        id={MESSAGE_EYEBROW_INPUT_ID}
        type="text"
        maxLength={MESSAGE_MAX_LENGTH.EYEBROW}
        placeholder={t.defaults.eyebrow}
        value={eyebrowInput}
        onChange={(event) => onEyebrowChange(event.target.value)}
        autoFocus
      />

      <label htmlFor={MESSAGE_TITLE_INPUT_ID}>
        {t.setup.messages.titleLabel}
      </label>
      <input
        id={MESSAGE_TITLE_INPUT_ID}
        type="text"
        maxLength={MESSAGE_MAX_LENGTH.TITLE}
        placeholder={t.defaults.title}
        value={titleInput}
        onChange={(event) => onTitleChange(event.target.value)}
      />

      <label htmlFor={MESSAGE_NOTE_INPUT_ID}>
        {t.setup.messages.noteLabel}
      </label>
      <textarea
        id={MESSAGE_NOTE_INPUT_ID}
        rows={3}
        maxLength={MESSAGE_MAX_LENGTH.NOTE}
        placeholder={t.defaults.note}
        value={noteInput}
        onChange={(event) => onNoteChange(event.target.value)}
      />

      {formError ? <p className="field-error">{formError}</p> : null}

      <div className="dialog-actions">
        <button
          type="button"
          className="secondary-action"
          onClick={closeDialog}
          disabled={isSubmitting}
        >
          {t.setup.messages.cancel}
        </button>
        <button type="submit" className="primary-action" disabled={isSubmitting}>
          {t.setup.messages.submit}
        </button>
      </div>
    </form>
  )
}
