import type { Day } from '../hooks/days'
import clsx from 'clsx'
import { getDate, getMonth, isBefore } from 'date-fns'
import { useShallow } from 'zustand/shallow'
import { useMarkState } from '../hooks/marks'
import { usePlanState } from '../hooks/plans'
import { isLeftMouse } from '../utils/events'
import { pick } from '../utils/utils'
import Mark from './Mark'

export default function CalendarDay(props: { day: Day }) {
  const planState = usePlanState(useShallow(state => pick(
    state,
    ['createPlan', 'updateEditingPlanDate', 'editPlan'],
  )))

  const markState = useMarkState(useShallow(state =>
    pick(state, ['addMark', 'updateEditingMark'])),
  )
  const marks = useMarkState(useShallow(state =>
    state.marks.filter(mark => mark.dayId === props.day.id),
  ))

  const date = getDate(props.day.date)
  const month = getMonth(props.day.date) + 1

  function handleMouseDown(e: React.MouseEvent) {
    if (!isLeftMouse(e)) {
      return
    }

    const plan = planState.createPlan(props.day.date)
    planState.editPlan(plan.id, 'end', props.day.date)
  }

  function onMouseEnter() {
    planState.updateEditingPlanDate(props.day.date)
    markState.updateEditingMark(props.day.id)
  }

  function handleContext() {
    markState.addMark(props.day.id)
  }

  return (
    <div
      id={props.day.id}
      className={clsx('calendar-day relative', {
        'calendar-day--peace': props.day.peace,
      })}
      onMouseDown={handleMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={handleContext}
    >
      <div className="x-center py-sm">
        <span className={clsx('center px-sm self-start shrink-0', {
          'bg-primary text-primary rounded-sm': props.day.today,
          'text-muted': isBefore(props.day.date, new Date()),
        })}
        >
          <span className="ws-nowrap">{month}月{date}</span>
          {props.day.today && <span className="ws-nowrap text-xs">&nbsp;(今日)</span>}
          {props.day.description && <span className="ws-nowrap vertical-baseline text-sm">&nbsp;({props.day.description})</span>}
        </span>
      </div>

      <div className="center flex-wrap gap-sm px-sm">
        {marks.map(mark => (
          <Mark key={mark.id} markId={mark.id} />
        ))}
      </div>
    </div>
  )
}
