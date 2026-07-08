import NumberFlow from '@number-flow/react'
import { useCountdown } from '../../providers/CountdownProvider'
import './TimeScale.css'

const timeUnitFormat = {
  minimumIntegerDigits: 2,
  useGrouping: false,
} satisfies Intl.NumberFormatOptions

const hourDigits = {
  1: { max: 2 },
  0: { max: 9 },
} satisfies Record<number, { max: number }>

const minuteSecondDigits = {
  1: { max: 5 },
  0: { max: 9 },
} satisfies Record<number, { max: number }>

export function TimeScale() {
  const { remainingTime, timeReadoutLabel } = useCountdown()

  return (
    <div
      className={`time-scale${remainingTime ? '' : ' is-loading'}`}
      aria-label={timeReadoutLabel}
    >
      <span className="time-part time-days">
        {remainingTime ? (
          <strong>
            <NumberFlow
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.days}
            />
          </strong>
        ) : (
          <small>dd</small>
        )}
      </span>
      <span className="time-colon">:</span>
      <span className="time-part time-hours">
        {remainingTime ? (
          <strong>
            <NumberFlow
              digits={hourDigits}
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.hours}
            />
          </strong>
        ) : (
          <small>hh</small>
        )}
      </span>
      <span className="time-colon">:</span>
      <span className="time-part time-minutes">
        {remainingTime ? (
          <strong>
            <NumberFlow
              digits={minuteSecondDigits}
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.minutes}
            />
          </strong>
        ) : (
          <small>mm</small>
        )}
      </span>
      <span className="time-colon">:</span>
      <span className="time-part time-seconds">
        {remainingTime ? (
          <strong>
            <NumberFlow
              digits={minuteSecondDigits}
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.seconds}
            />
          </strong>
        ) : (
          <small>ss</small>
        )}
      </span>
    </div>
  )
}
