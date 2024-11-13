import type { ChineseDay } from '../src/utils/chinese-days'
import fs from 'node:fs/promises'
import glob from 'tiny-glob'

interface RawChineseHoliday {
  name: string
  date: string
  isOffDay: boolean
}

async function main() {
  const files = await glob('./holiday-cn/202*.json', {
    absolute: true,
  })

  const holidays: ChineseDay[] = []
  for await (const file of files) {
    const days: RawChineseHoliday[] = (await import(file)).default.days
    for (const day of days) {
      const name = day.isOffDay ? day.name : `${day.name}补班`
      holidays.push([name, day.date, day.isOffDay])
    }
  }

  await fs.writeFile('./src/chinese-holidays.json', JSON.stringify(holidays))
}

main()
