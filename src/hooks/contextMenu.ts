import type { MotionStyle } from 'framer-motion'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ContextMenuState {
  planId: string | null
  rowId: string | null
  open: (planId: string, rowId: string) => void
  close: () => void

  style: MotionStyle
  setStyle: (style: MotionStyle) => void
}

export const useContextMenuState = create(devtools<ContextMenuState>(set => ({
  planId: null,
  rowId: null,
  open(planId: string, rowId: string) {
    set({ planId, rowId })
  },
  close() {
    set({ planId: null, rowId: null })
  },

  style: {},
  setStyle(style: MotionStyle) {
    set({ style })
  },
})))
