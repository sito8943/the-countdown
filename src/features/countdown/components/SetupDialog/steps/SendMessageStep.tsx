import { t } from '../../../../../lang'
import {
  Button,
  BUTTON_VARIANT,
  Textarea,
} from '../../../../../shared/components/elements'
import {
  MESSAGE_MAX_LENGTH,
  PARTNER_MESSAGE_INPUT_ID,
} from '../../../constants'
import { useCountdown } from '../../../providers/CountdownProvider'

export function SendMessageStep() {
  const {
    messageInput,
    onMessageChange,
    messageCopied,
    submitSendMessage,
    copyCurrentUrl,
    closeDialog,
    formError,
    isSubmitting,
  } = useCountdown()

  return (
    <form className="setup-form" onSubmit={submitSendMessage}>
      <div>
        <p className="eyebrow">{t.setup.sendMessage.eyebrow}</p>
        <h2>{t.setup.sendMessage.title}</h2>
        <p>{t.setup.sendMessage.description}</p>
      </div>

      <label htmlFor={PARTNER_MESSAGE_INPUT_ID}>
        {t.setup.sendMessage.label}
      </label>
      <Textarea
        id={PARTNER_MESSAGE_INPUT_ID}
        rows={4}
        maxLength={MESSAGE_MAX_LENGTH.MESSAGE}
        placeholder={t.setup.sendMessage.placeholder}
        value={messageInput}
        onChange={(event) => onMessageChange(event.target.value)}
        autoFocus
      />
      <span className="char-count">
        {messageInput.length}/{MESSAGE_MAX_LENGTH.MESSAGE}
      </span>

      {formError ? <p className="field-error">{formError}</p> : null}

      <div className="dialog-actions">
        <Button
          type="button"
          variant={BUTTON_VARIANT.SECONDARY}
          onClick={closeDialog}
          disabled={isSubmitting}
        >
          {t.setup.sendMessage.cancel}
        </Button>
        <Button
          type="button"
          variant={BUTTON_VARIANT.SECONDARY}
          onClick={copyCurrentUrl}
        >
          {messageCopied
            ? t.setup.sendMessage.copied
            : t.setup.sendMessage.copy}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {t.setup.sendMessage.submit}
        </Button>
      </div>
    </form>
  )
}
