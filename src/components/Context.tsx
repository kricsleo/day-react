import { AnimatePresence, motion, type MotionStyle } from 'motion/react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { isEscKey } from '../utils/events'

export default function Context(props: {
  name: string
  opened: boolean
  style: MotionStyle
  portalDomId: string | null
  onClose: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const portalDom = props.portalDomId ? document.getElementById(props.portalDomId) : null

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEscKey(e)) {
        props.onClose()
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        props.onClose()
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside, { capture: true })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside, { capture: true })
    }
  }, [ref.current])

  return portalDom ? createPortal(
    <AnimatePresence>
      { props.opened ? (
        <motion.div
          ref={ref}
          layoutId={props.name}
          className="absolute z-9 w-210 border rounded bg-popover p-xs shadow-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={props.style}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          {props.children}
        </motion.div>
      ) : null }
    </AnimatePresence>,
    portalDom,
  ) : null
}
