import type { ReactNode } from 'react'

export type TooltipProps = {
  /** Text shown inside the popup. */
  content: ReactNode
  /** Trigger element (e.g. an IconButton) that reveals the popup. */
  children: ReactNode
  className?: string
}
