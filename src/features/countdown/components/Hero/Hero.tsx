import { useCountdown } from '../../providers/CountdownProvider'
import './Hero.css'

export function Hero() {
  const { displayEyebrow, displayTitle } = useCountdown()

  return (
    <section className="countdown-hero" aria-labelledby="countdown-title">
      <div className="hero-copy">
        <p className="eyebrow">{displayEyebrow}</p>
        <h1 id="countdown-title">{displayTitle}</h1>
      </div>
    </section>
  )
}
