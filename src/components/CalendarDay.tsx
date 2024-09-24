import cls from 'classnames'
import { getDate, getMonth } from 'date-fns'
import { useDayState } from '../hooks/days'
import HighlightCard from './HighlightCard'

export default function Day(props: { id: string }) {
  const day = useDayState(state => state.days.find(day => day.id === props.id)!)
  const date = getDate(day.date)
  const month = getMonth(day.date) + 1

  return (
    <li className={cls('calendar-day relative of-hidden', {
      'calendar-day--peace': day.peace,
    })}
    >
      {/* { day.today && <HighlightCard />} */}

      <div className="center py-sm">
        <span className={cls('center px-sm', {
          'bg-primary text-primary rounded-sm': day.today,
        })}
        >
          <span>{month}月{date}</span>
          {day.today && <span className="text-xs">(今天)</span>}
        </span>
      </div>
    </li>
  )
}
