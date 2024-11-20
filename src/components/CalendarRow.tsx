import {
  areIntervalsOverlapping,
  isWithinInterval,
} from 'date-fns'
import { AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import { useDayState } from '../hooks/days'
import { usePlanState } from '../hooks/plans'
import CalendarDay from './CalendarDay'
import CalendarPlan from './CalendarPlan'

export default function CalenderRow(props: {
  rowId: string
  startDate: Date
  endDate: Date
}) {
  const days = useDayState(useShallow(state => state.days.filter(
    day => isWithinInterval(day.date, {
      start: props.startDate,
      end: props.endDate,
    }),
  )))

  const plans = usePlanState(useShallow(state => {
    return state.plans
      .filter(plan => areIntervalsOverlapping({
        start: props.startDate,
        end: props.endDate,
      }, plan, { inclusive: true }))
  }))
  const maxPlanOrder = plans.reduce((max, plan) => Math.max(max, plan.order), 0)
  const height = Math.max(1 * 24 + 100, maxPlanOrder * 24 + 100)

  return (
    <div className="calendar-row relative">
      <div className="grid cols-7 transition-height" style={{ height }}>
        { days.map(day => (
          <CalendarDay key={day.id} day={day} />
        ))}
      </div>

      <AnimatePresence>
        {plans.map(plan => (
          <CalendarPlan
            key={plan.id}
            planRowId={`${plan.id}-${props.rowId}`}
            planId={plan.id}
            startDate={props.startDate}
            endDate={props.endDate}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
