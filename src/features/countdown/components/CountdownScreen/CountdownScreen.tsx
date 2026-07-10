import { lazy, Suspense, useState } from 'react'
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
  const [shouldRenderSetupDialog, setShouldRenderSetupDialog] =
    useState(isSetupOpen)

  if (isSetupOpen && !shouldRenderSetupDialog) {
    setShouldRenderSetupDialog(true)
  }

  return (
    <>
      <TopControls />
      <Hero />
      <CountdownCard />
      <CountdownFabs />
      {shouldRenderSetupDialog ? (
        <Suspense fallback={null}>
          <SetupDialog
            onExitComplete={() => setShouldRenderSetupDialog(false)}
          />
        </Suspense>
      ) : null}
    </>
  )
}
