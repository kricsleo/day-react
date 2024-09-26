import type { ChineseHoliday } from '../src/utils/chinese-days'
import fs from 'node:fs/promises'
import glob from 'tiny-glob'

interface RawChineseHoliday {
  name: string
  range: [string, string?]
  type: 'workingday' | 'holiday'
}

async function main() {
  const files = await glob('./chinese-holidays-data/data/2*.json', {
    absolute: true,
  })

  const holidays: ChineseHoliday[] = []
  for await (const file of files) {
    const days: RawChineseHoliday[] = (await import(file)).default
    for (const day of days) {
      holidays.push([day.name, day.range, day.type])
    }
  }

  await fs.writeFile('./src/chinese-holidays.json', JSON.stringify(holidays))
}

main()
