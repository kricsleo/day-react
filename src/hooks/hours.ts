import { create } from 'zustand'

interface HourState {
  hour: number
  increase: () => void
  decrease: () => void
}

export const useHourState = create<HourState>(set => ({
  hour: 8,
  increase: () => set(state => ({ hour: state.hour + 1 })),
  decrease: () => set(state => ({ hour: state.hour - 1 })),
}))
