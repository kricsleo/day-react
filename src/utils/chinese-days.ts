import { isSameDay, isWeekend } from 'date-fns'
import chineseHolidays from '../chinese-holidays.json'

export type ChineseDay = [
  name: string,
  date: string,
  isHoliday: boolean,
]

export function isChineseHoliday(date: Date): boolean {
  const holiday = findChineseDay(date)
  return Boolean(holiday && holiday[2])
}

export function isChineseWorkingDay(date: Date): boolean {
  const holiday = findChineseDay(date)
  return Boolean(holiday && !holiday[2])
}

export function findChineseDay(date: Date): ChineseDay | undefined {
  return (chineseHolidays as ChineseDay[])
    .find(holiday => isSameDay(date, new Date(`${holiday[1]}T00:00`)))
}

export function isWorkingDay(date: Date): boolean {
  return isWeekend(date)
    ? isChineseWorkingDay(date)
    : !isChineseHoliday(date)
}
