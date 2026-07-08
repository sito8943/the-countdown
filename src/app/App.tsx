import { CountdownProvider, CountdownScreen } from '../features/countdown'
import './App.css'

export function App() {
  return (
    <CountdownProvider>
      <main className="countdown-shell">
        <CountdownScreen />
      </main>
    </CountdownProvider>
  )
}
