import { useRef } from 'react'
import { useDayState } from '../hooks/days'
import CalendarDay from './CalendarDay'
import InfiniteLoader from './InfiniteLoader'
import WeekHeaders from './WeekHeaders'

export default function Calendar() {
  const containerDom = useRef<HTMLDivElement>(null)
  const days = useDayState(state => state.days)
  const addPrevDays = useDayState(state => state.addPrevDays)
  const addNextDays = useDayState(state => state.addNextDays)

  return (
    <section>
      <WeekHeaders />

      <div className="h-80vh of-auto">

        <InfiniteLoader name="prev" container={containerDom} onLoad={addPrevDays} />

        <ul className="grid cols-7">
          {days.map(day => <CalendarDay key={day.id} id={day.id} />)}
        </ul>

        <InfiniteLoader name="next" container={containerDom} onLoad={addNextDays} />
      </div>
    </section>
  )
}
