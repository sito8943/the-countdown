import { useEffect, useId, useRef, useState } from 'react'
import { classNames } from '../../../utils'
import type { TooltipProps } from './types'
import './Tooltip.css'

/**
 * Popup label shown on hover/focus (desktop) and on tap (mobile touch).
 * Wraps a trigger such as an IconButton; closes on outside tap or Escape.
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <span
      ref={wrapperRef}
      className={classNames('tooltip', className)}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setOpen(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setOpen(false)
      }}
      onPointerUp={(event) => {
        // Touch/pen have no hover: tap toggles. Mouse is handled by enter/leave.
        if (event.pointerType !== 'mouse') setOpen((prev) => !prev)
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? tooltipId : undefined}>{children}</span>
      <span role="tooltip" id={tooltipId} className="tooltip-popup" data-open={open}>
        {content}
      </span>
    </span>
  )
}
