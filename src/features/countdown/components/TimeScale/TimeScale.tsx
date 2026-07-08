import { useCountdown } from '../../providers/CountdownProvider'
import './TimeScale.css'

export function TimeScale() {
  const { remainingTime, timeReadout, timeReadoutLabel } = useCountdown()

  return (
    <div
      className={`time-scale${remainingTime ? '' : ' is-loading'}`}
      aria-label={timeReadoutLabel}
    >
      <span className="time-part time-days">
        {remainingTime ? <strong>{timeReadout.days}</strong> : <small>dd</small>}
      </span>
      <span className="time-colon">:</span>
      <span className="time-part time-hours">
        {remainingTime ? (
          <strong>{timeReadout.hours}</strong>
        ) : (
          <small>hh</small>
        )}
      </span>
      <span className="time-colon">:</span>
      <span className="time-part time-minutes">
        {remainingTime ? (
          <strong>{timeReadout.minutes}</strong>
        ) : (
          <small>mm</small>
        )}
      </span>
      <span className="time-colon">:</span>
      <span className="time-part time-seconds">
        {remainingTime ? (
          <strong>{timeReadout.seconds}</strong>
        ) : (
          <small>ss</small>
        )}
      </span>
    </div>
  )
}
