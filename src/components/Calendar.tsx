import { useEffect, useRef } from 'react'
import { useDayState } from '../hooks/days'
import { usePlanState } from '../hooks/plans'
import { chunk } from '../utils/utils'
import CalenderRow from './CalendarRow'
import InfiniteLoader from './InfiniteLoader'
import WeekHeaders from './WeekHeaders'

export default function Calendar() {
  const containerDom = useRef<HTMLDivElement>(null)

  const dayState = useDayState()
  const weeks = chunk(dayState.days, 7)

  const cancelEditPlan = usePlanState(state => state.cancelEditPlan)
  useEffect(() => {
    window.addEventListener('mouseup', cancelEditPlan)
  }, [])

  return (
    <section onContextMenu={e => e.preventDefault()}>
      <WeekHeaders />

      <div className="h-100vh of-x-hidden of-y-auto">

        {/* <InfiniteLoader name="prev" container={containerDom} onLoad={addPrevDays} /> */}

        {weeks.map(week => (
          <CalenderRow
            key={week[0]!.id}
            rowId={week[0]!.id}
            startDate={week[0]!.date}
            endDate={week[week.length - 1]!.date}
          />
        ))}

        <InfiniteLoader
          name="next"
          container={containerDom}
          onLoad={dayState.addNextDays}
        />
      </div>
    </section>
  )
}
