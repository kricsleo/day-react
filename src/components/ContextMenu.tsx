import { AnimatePresence, motion, type MotionStyle } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { isEsc } from '../utils/events'

export default function ContextMenu(props: {
  name: string
  opened: boolean
  style: MotionStyle
  portalDomId?: string
  onClose: () => void
  children: React.ReactNode
}) {
  const portalDom = props.portalDomId ? document.getElementById(props.portalDomId) : null
  console.log('portalDom', portalDom)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEsc(e)) {
        props.onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  return portalDom ? createPortal(
    <AnimatePresence>
      { props.opened ? (
        <motion.div
          layoutId={props.name}
          className="absolute z-9 w-270 select-none border rounded bg-popover p-xs shadow-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={props.style}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          onClick={e => e.stopPropagation()}
        >
          {props.children}
        </motion.div>
      ) : null }
    </AnimatePresence>,
    portalDom,
  ) : null
}
