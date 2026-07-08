import { createContext } from 'react'
import type { CountdownContextValue } from './types'

export const CountdownContext = createContext<CountdownContextValue | null>(null)
