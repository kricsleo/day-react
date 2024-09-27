import cls from 'classnames'
import { getDate, getMonth } from 'date-fns'
import { useDayState } from '../hooks/days'
import { useMouseUp } from '../hooks/events'
import { usePlanState } from '../hooks/plans'
import HighlightCard from './HighlightCard'

export default function Day(props: { id: string }) {
  const day = useDayState(state => state.days.find(day => day.id === props.id)!)
  const date = getDate(day.date)
  const month = getMonth(day.date) + 1

  const createPlan = usePlanState(state => state.create)
  const updateEditingPlanDate = usePlanState(state => state.updateEditingPlanDate)
  const editingPlan = usePlanState(state => state.editing)
  const cancelEditingPlan = usePlanState(state => state.cancelEditing)

  function handleMouseDown() {
    console.log('down', day.date)
    const plan = createPlan(day.date)
    editingPlan(plan.id, 'end', day.date)
  }

  function onMouseEnter() {
    // console.log('enter', day.date)
    updateEditingPlanDate(day.date)
  }

  useMouseUp(cancelEditingPlan)

  return (
    <div
      className={cls('calendar-day', {
        'calendar-day--peace': day.peace,
      })}
      onMouseDown={handleMouseDown}
      onMouseEnter={onMouseEnter}
    >
      {/* { day.today && <HighlightCard />} */}

      <div className="center py-sm">
        <span className={cls('center px-sm select-none', {
          'bg-primary text-primary rounded-sm': day.today,
        })}
        >
          <span className="ws-nowrap">{month}月{date}</span>
          {day.today && <span className="ws-nowrap text-sm">&nbsp;(今天)</span>}
          {day.description && <span className="ws-nowrap vertical-baseline text-sm">&nbsp;({day.description})</span>}
        </span>
      </div>
    </div>
  )
}
