import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
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
      <NumberFlowGroup>
        <span className="time-part time-days">
          {remainingTime ? (
            <NumberFlow
              className="time-number"
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.days}
            />
          ) : (
            <small>dd</small>
          )}
        </span>
        <span className="time-colon">:</span>
        <span className="time-part time-hours">
          {remainingTime ? (
            <NumberFlow
              className="time-number"
              digits={hourDigits}
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.hours}
            />
          ) : (
            <small>hh</small>
          )}
        </span>
        <span className="time-colon">:</span>
        <span className="time-part time-minutes">
          {remainingTime ? (
            <NumberFlow
              className="time-number"
              digits={minuteSecondDigits}
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.minutes}
            />
          ) : (
            <small>mm</small>
          )}
        </span>
        <span className="time-colon">:</span>
        <span className="time-part time-seconds">
          {remainingTime ? (
            <NumberFlow
              className="time-number"
              digits={minuteSecondDigits}
              format={timeUnitFormat}
              trend={-1}
              value={remainingTime.seconds}
            />
          ) : (
            <small>ss</small>
          )}
        </span>
      </NumberFlowGroup>
    </div>
  )
}
