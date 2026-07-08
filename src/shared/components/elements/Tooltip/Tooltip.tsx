import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
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
  const popupRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()

  // Keep the popup inside the viewport: nudge it left/right so neither edge
  // clips (pure CSS anchoring can't know the trigger's offset). Runs even while
  // closed — the popup stays mounted (for the fade), and its CSS left:0 at a
  // right-side trigger would otherwise push the box past the viewport edge and
  // add page scroll. The correction is applied via the `left` property, NOT a
  // transform: Safari/WebKit still counts a transformed element's ORIGINAL box
  // in the scrollable overflow region, so translateX moves the pixels but not
  // the scroll area — the page still scrolls to the off-screen origin. Moving
  // the real layout box updates both visual and scroll extent everywhere.
  useLayoutEffect(() => {
    function place() {
      const popup = popupRef.current
      if (!popup) return
      const margin = 12
      // Measure from the un-shifted position so the correction stays stable.
      popup.style.left = '0px'
      const rect = popup.getBoundingClientRect()
      let next = 0
      const overflowRight = rect.right - (window.innerWidth - margin)
      if (overflowRight > 0) next = -overflowRight
      if (rect.left + next < margin) next = margin - rect.left
      popup.style.left = `${next}px`
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open])

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
      <span
        ref={popupRef}
        role="tooltip"
        id={tooltipId}
        className="tooltip-popup"
        data-open={open}
      >
        {content}
      </span>
    </span>
  )
}
