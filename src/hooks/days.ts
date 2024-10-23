import {
  addDays,
  eachDayOfInterval,
  isToday,
  nextMonday,
  previousSunday,
  startOfWeek,
  subDays,
  subWeeks,
} from 'date-fns'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { findChineseDay, isWorkingDay } from '../utils/chinese-days'

export interface Day {
  id: string
  date: Date
  working: boolean
  peace: boolean
  today: boolean
  description?: string
}

const INTERVAL_DAYS = 7 * 20

export const useDayState = create(combine({
  days: genInitialDays(),

}, set => ({
  addPrevDays: () => set(state => {
    const _firstDate = state.days[0]?.date
    const firstDate = _firstDate || nextMonday(new Date())

    const prevDays = eachDayOfInterval({
      start: subDays(firstDate, INTERVAL_DAYS),
      end: subDays(firstDate, 1),
    }).map(dateToDay)

    return { days: [...prevDays, ...state.days] }
  }),

  addNextDays: () => set(state => {
    const _lastDate = state.days[state.days.length - 1]?.date
    const lastDate = _lastDate || previousSunday(new Date())

    const nextDays = eachDayOfInterval({
      start: addDays(lastDate, 1),
      end: addDays(lastDate, INTERVAL_DAYS),
    }).map(dateToDay)

    return { days: [...state.days, ...nextDays] }
  }),

})))

function genInitialDays() {
  const start = startOfWeek(subWeeks(new Date(), 2), { weekStartsOn: 1 })
  const end = addDays(start, INTERVAL_DAYS - 1)
  return eachDayOfInterval({ start, end }).map(dateToDay)
}

function dateToDay(date: Date): Day {
  const working = isWorkingDay(date)

  return {
    id: getDateId(date),
    date,
    working,
    peace: !working,
    today: isToday(date),
    description: findChineseDay(date)?.[0],
  }
}

export function getDateId(date: Date) {
  return date.toISOString().slice(0, 10)
}
