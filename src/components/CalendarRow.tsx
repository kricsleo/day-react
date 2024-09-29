import { areIntervalsOverlapping } from 'date-fns'
import { useShallow } from 'zustand/react/shallow'
import { useDayState } from '../hooks/days'
import { usePlanState } from '../hooks/plans'
import CalendarDay from './CalendarDay'
import CalendarPlan from './CalendarPlan'

export default function CalenderRow(props: {
  dayIds: string[]
  planIds?: string[]
}) {
  const startDate = useDayState(state =>
    state.days.find(day => day.id === props.dayIds[0])!.date,
  )
  const endDate = useDayState(state =>
    state.days.find(day => day.id === props.dayIds[props.dayIds.length - 1])!.date,
  )

  const plans = usePlanState(useShallow(state => {
    return state.plans.filter(plan => areIntervalsOverlapping({
      start: startDate,
      end: endDate,
    }, plan, { inclusive: true }))
  }))

  return (
    <div className="relative">
      <div className="grid cols-7">
        { props.dayIds.map(dayId => (
          <CalendarDay key={dayId} id={dayId} />
        ))}
      </div>

      {plans.map(plan => (
        <CalendarPlan
          key={plan.id}
          planId={plan.id}
          startDate={startDate}
          endDate={endDate}
        />
      ))}
    </div>
  )
}
