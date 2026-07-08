import { faCircleInfo, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { t } from '../../../../lang'
import { IconButton, Tooltip } from '../../../../shared/components/elements'
import { useTheme } from '../../../../shared/hooks'
import { formatPlacedDate } from '../../../../shared/utils'
import { useCountdown } from '../../providers/CountdownProvider'
import './TopControls.css'

/**
 * Fixed cluster in the top-right corner: the countdown info button (only once a
 * countdown exists) on the left, and the dark/light theme toggle on the right.
 */
export function TopControls() {
  const { countdown } = useCountdown()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="top-controls enter-up">
      {countdown ? (
        <Tooltip
          content={t.summary.createdBy(
            countdown.ownerNickname,
            formatPlacedDate(countdown.placedAt),
          )}
        >
          <IconButton
            className="info-trigger"
            icon={faCircleInfo}
            label={t.summary.info}
          />
        </Tooltip>
      ) : null}
      <IconButton
        className="theme-toggle"
        icon={isDark ? faSun : faMoon}
        label={isDark ? t.theme.toLight : t.theme.toDark}
        onClick={toggleTheme}
      />
    </div>
  )
}
