import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useHourState = create(combine({
  hour: 8,

}, set => ({
  increase: () => set(state => ({ hour: state.hour + 1 })),

  decrease: () => set(state => ({ hour: state.hour - 1 })),
})))
