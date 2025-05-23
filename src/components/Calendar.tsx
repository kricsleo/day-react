import { useEffect, useRef } from 'react'
import { useDayState } from '../hooks/days'
import { useMarkState } from '../hooks/marks'
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
  const cancelEditMark = useMarkState(state => state.cancelEditMark)
  useEffect(() => {
    window.addEventListener('mouseup', () => {
      cancelEditPlan()
      cancelEditMark()
    })
  }, [])

  function loadPrev() {
    dayState.addPrevDays()
    containerDom.current!.scrollTop = 1
  }

  return (
    <main className="h-screen flex grow-1 flex-col" onContextMenu={e => e.preventDefault()}>
      <WeekHeaders />

      <div className="grow-1 of-x-hidden of-y-auto" ref={containerDom}>

        <InfiniteLoader
          name="prev"
          container={containerDom}
          onLoad={loadPrev}
        />

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
    </main>
  )
}
