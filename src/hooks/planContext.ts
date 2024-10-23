import type { MotionStyle } from 'framer-motion'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { getContextStyle } from '../utils/context'

export const usePlanContextState = create(combine({
  planId: null as string | null,
  planRowId: null as string | null,

  style: {} as MotionStyle,

}, set => ({
  open: (planId: string, planRowId: string, e: React.MouseEvent) => {
    const style = getContextStyle(e)
    set({ planId, planRowId, style })
  },

  close: () => set({ planId: null, planRowId: null, style: {} }),
})))
