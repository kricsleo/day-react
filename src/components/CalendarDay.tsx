import type { Day } from '../hooks/days'
import cls from 'clsx'
import { getDate, getMonth } from 'date-fns'
import { useShallow } from 'zustand/shallow'
import { useContextMenuState } from '../hooks/contextMenu'
import { usePlanState } from '../hooks/plans'
import { isLeftClick } from '../utils/events'
import { pick } from '../utils/utils'

export default function CalendarDay(props: { day: Day }) {
  const planState = usePlanState(useShallow(state => pick(
    state,
    ['createPlan', 'updateEditingPlanDate', 'editPlan'],
  )))

  const closeContextMenu = useContextMenuState(state => state.close)

  const date = getDate(props.day.date)
  const month = getMonth(props.day.date) + 1

  function handleMouseDown(e: React.MouseEvent) {
    if (!isLeftClick(e)) {
      return
    }

    const plan = planState.createPlan(props.day.date)
    planState.editPlan(plan.id, 'end', props.day.date)
    closeContextMenu()
  }

  function onMouseEnter() {
    planState.updateEditingPlanDate(props.day.date)
  }

  return (
    <div
      className={cls('calendar-day h-100', {
        'calendar-day--peace': props.day.peace,
      })}
      onMouseDown={handleMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <div className="center py-sm">
        <span className={cls('center px-sm select-none', {
          'bg-primary text-primary rounded-sm': props.day.today,
        })}
        >
          <span className="ws-nowrap">{month}月{date}</span>
          {props.day.today && <span className="ws-nowrap text-sm">&nbsp;(今天)</span>}
          {props.day.description && <span className="ws-nowrap vertical-baseline text-sm">&nbsp;({props.day.description})</span>}
        </span>
      </div>
    </div>
  )
}
