import type { MotionStyle } from 'framer-motion'
import { create } from 'zustand'

interface MarkContextMenuState {
  markId: string | null
  style: MotionStyle
  open: (markId: string, e: React.MouseEvent) => void
  close: () => void
}

export const useMarkContextMenuState = create<MarkContextMenuState>(set => ({
  markId: null,
  style: {},
  open(markId, e) {
    e.preventDefault()

    const rect = e.currentTarget.getBoundingClientRect()
    const horizontalGap = 20
    const preferLeft = window.innerWidth - e.clientX > 500
    const preferTop = window.innerHeight - e.clientY > 300
    const style = {
      top: preferTop ? e.clientY - rect.top : 'auto',
      left: preferLeft ? e.clientX - rect.left + horizontalGap : 'auto',
      bottom: preferTop ? 'auto' : rect.bottom - e.clientY,
      right: preferLeft ? 'auto' : rect.right - e.clientX + horizontalGap,
    }
    set({ markId, style })
  },
  close() {
    set({ markId: null, style: {} })
  },
}))
