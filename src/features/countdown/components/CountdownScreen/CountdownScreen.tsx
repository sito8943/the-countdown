import { lazy, Suspense } from 'react'
import { SETUP_STEP } from '../../constants'
import { useCountdown } from '../../providers/CountdownProvider'
import { CountdownCard } from '../CountdownCard'
import { CountdownFabs } from '../CountdownFabs'
import { Hero } from '../Hero'
import { TopControls } from '../TopControls'

// The setup dialog and all its steps are only needed while configuring or
// editing the countdown. Split them into their own chunk so returning users
// (countdown already set) never download that code.
const SetupDialog = lazy(() =>
  import('../SetupDialog').then((module) => ({ default: module.SetupDialog })),
)

export function CountdownScreen() {
  const { setupStep } = useCountdown()
  const isSetupOpen = setupStep !== SETUP_STEP.IDLE

  return (
    <>
      <TopControls />
      <Hero />
      <CountdownCard />
      <CountdownFabs />
      {isSetupOpen ? (
        <Suspense fallback={null}>
          <SetupDialog />
        </Suspense>
      ) : null}
    </>
  )
}
