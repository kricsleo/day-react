import type { MotionStyle } from 'motion/react'
import type React from 'react'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { getContextStyle } from '../utils/context'

export const useMarkContextState = create(combine({
  markId: null as string | null,

  style: {} as MotionStyle,

}, set => ({
  open: (markId: string, e: React.MouseEvent) => {
    const style = getContextStyle(e)
    set({ markId, style })
  },

  close: () => set({ markId: null, style: {} }),
})))
