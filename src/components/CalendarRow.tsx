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
import ContextMenu from './ContextMenu'

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

  return (
    <div className="calendar-row relative">
      <div className="grid cols-7">
        { days.map(day => (
          <CalendarDay key={day.id} day={day} />
        ))}
      </div>

      <AnimatePresence>
        {plans.map(plan => (
          <CalendarPlan
            key={plan.id}
            rowId={props.rowId}
            planId={plan.id}
            startDate={props.startDate}
            endDate={props.endDate}
          />
        ))}
      </AnimatePresence>

      <ContextMenu rowId={props.rowId} />
    </div>
  )
}
