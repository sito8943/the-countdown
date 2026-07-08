import { t } from '../../../../../lang'
import { NICKNAME_INPUT_ID } from '../../../constants'
import { useCountdown } from '../../../providers/CountdownProvider'

export function NicknameStep() {
  const {
    nicknameInput,
    onNicknameChange,
    submitNickname,
    formError,
    isSubmitting,
  } = useCountdown()

  return (
    <form className="setup-form" onSubmit={submitNickname}>
      <div>
        <p className="eyebrow">{t.setup.nickname.eyebrow}</p>
        <h2>{t.setup.nickname.title}</h2>
        <p>{t.setup.nickname.description}</p>
      </div>

      <label htmlFor={NICKNAME_INPUT_ID}>{t.setup.nickname.label}</label>
      <input
        id={NICKNAME_INPUT_ID}
        type="text"
        value={nicknameInput}
        onChange={(event) => onNicknameChange(event.target.value)}
        autoFocus
      />

      {formError ? <p className="field-error">{formError}</p> : null}

      <button type="submit" className="primary-action" disabled={isSubmitting}>
        {t.setup.nickname.submit}
      </button>
    </form>
  )
}
