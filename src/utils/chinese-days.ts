import { isWeekend, isWithinInterval } from 'date-fns'
import chineseHolidays from '../chinese-holidays.json'

export type ChineseHoliday = [
  name: string,
  range: [startDate: string, endDate?: string],
  type: 'workingday' | 'holiday',
]

export function isChineseHoliday(date: Date): boolean {
  const holiday = findChineseHoliday(date)
  return holiday?.[2] === 'holiday'
}

export function isChineseWorkingDay(date: Date): boolean {
  const holiday = findChineseHoliday(date)
  return holiday?.[2] === 'workingday'
}

export function findChineseHoliday(date: Date): ChineseHoliday | undefined {
  return (chineseHolidays as ChineseHoliday[]).find(holiday => isWithinInterval(date, {
    // `T00:00` converts date to local timezone
    start: new Date(`${holiday[1][0]}T00:00`),
    end: new Date(`${holiday[1][1] || holiday[1][0]}T00:00`),
  }))
}

export function isWorkingDay(date: Date): boolean {
  return isWeekend(date)
    ? isChineseWorkingDay(date)
    : !isChineseHoliday(date)
}
