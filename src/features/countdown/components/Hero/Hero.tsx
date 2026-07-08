import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { t } from '../../../../lang'
import { IconButton, Tooltip } from '../../../../shared/components/elements'
import { formatPlacedDate } from '../../../../shared/utils'
import { useCountdown } from '../../providers/CountdownProvider'
import './Hero.css'

export function Hero() {
  const { displayEyebrow, displayTitle, countdown } = useCountdown()

  return (
    <section className="countdown-hero" aria-labelledby="countdown-title">
      <div className="hero-copy">
        <p className="eyebrow">{displayEyebrow}</p>
        <div className="hero-title-row">
          <h1 id="countdown-title">{displayTitle}</h1>
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
        </div>
      </div>
    </section>
  )
}
