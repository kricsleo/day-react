import { useEffect, useRef } from 'react'
import { useDayState } from '../hooks/days'
import { usePlanState } from '../hooks/plans'
import { chunk } from '../utils/chunk'
import CalenderRow from './CalendarRow'
import InfiniteLoader from './InfiniteLoader'
import WeekHeaders from './WeekHeaders'

export default function Calendar() {
  const containerDom = useRef<HTMLDivElement>(null)

  // This avoid the infinite loop of rerendering.
  // Only rerender when the days length changed.
  const dayIds = useDayState(state => state.days.map(day => day.id).join('❤️'))
  const dayIdGruops = dayIds ? chunk(dayIds.split('❤️'), 7) : []

  // const addPrevDays = useDayState(state => state.addPrevDays)
  const addNextDays = useDayState(state => state.addNextDays)

  const cancelEditingPlan = usePlanState(state => state.cancelEditing)
  useEffect(() => {
    window.addEventListener('mouseup', cancelEditingPlan)
  }, [])

  return (
    <section>
      <WeekHeaders />

      <div className="h-80vh of-auto">

        {/* <InfiniteLoader name="prev" container={containerDom} onLoad={addPrevDays} /> */}

        {dayIdGruops.map(group => (
          <CalenderRow key={group[0]} dayIds={group} />
        ))}

        <InfiniteLoader name="next" container={containerDom} onLoad={addNextDays} />
      </div>
    </section>
  )
}
