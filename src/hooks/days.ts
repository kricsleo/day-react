import { addDays, eachDayOfInterval, isToday, nextMonday, previousSunday } from 'date-fns'
import { create } from 'zustand'
import { isWorkingDay } from '../utils/chinese-days'

interface Day {
  id: string
  date: Date
  working: boolean
  peace: boolean
  today: boolean
}

interface DayState {
  days: Day[]
  addDays: (day: Day[]) => void
  addPrevDays: () => void
  addNextDays: () => void
}

const intervalDays = 7 * 8

export const useDayState = create<DayState>(set => ({
  days: [],
  addDays: days => set(state => ({ days: [...state.days, ...days] })),

  addPrevDays: () => set(state => {
    const _firstDate = state.days[0]?.date
    const firstDate = _firstDate || nextMonday(new Date())

    const prevDays = eachDayOfInterval({
      start: addDays(firstDate, -intervalDays),
      end: addDays(firstDate, -1),
    }).map(dateToDay)

    return { days: [...prevDays, ...state.days] }
  }),

  addNextDays: () => set(state => {
    const _lastDate = state.days[state.days.length - 1]?.date
    const lastDate = _lastDate || previousSunday(new Date())

    const nextDays = eachDayOfInterval({
      start: addDays(lastDate, 1),
      end: addDays(lastDate, intervalDays),
    }).map(dateToDay)

    return { days: [...state.days, ...nextDays] }
  }),

}))

function dateToDay(date: Date): Day {
  const working = isWorkingDay(date)
  return {
    id: date.toISOString(),
    date,
    working,
    peace: !working,
    today: isToday(date),
  }
}
