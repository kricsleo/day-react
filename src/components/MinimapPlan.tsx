import { eachDayOfInterval } from 'date-fns'
import { motion } from 'framer-motion'
import { useShallow } from 'zustand/shallow'
import { pickColor, useColorValue } from '../hooks/colors'
import { useHourState } from '../hooks/hours'
import { type Plan, usePlanState } from '../hooks/plans'
import { isWorkingDay } from '../utils/chinese-days'
import { scrollToDay } from '../utils/scroll'
import { pick } from '../utils/utils'

export default function MinimapPlan(props: { plan: Plan }) {
  const planState = usePlanState(useShallow(state => ({
    ...pick(state, ['deletePlan', 'activePlan']),
    active: state.activePlanId === props.plan.id,
    editing: state.editingPlanId === props.plan.id,
  })))

  const hoursPerDay = useHourState(state => state.hour)

  const planDays = eachDayOfInterval({ start: props.plan.start, end: props.plan.end })
  const workingDays = planDays.filter(day => isWorkingDay(day)).length
  const workingHours = workingDays * hoursPerDay

  const opacity = planState.editing || planState.active ? 1 : 0.75
  const backgroundColor = useColorValue(props.plan?.color || pickColor())

  return (
    <motion.li
      className="y-center gap-sm"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 20, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <button
        className="y-center grow-1 border-l-6 border-accent rounded-xs px-xs text-sm transition-[opacity,colors]"
        style={{ backgroundColor, opacity }}
        onMouseEnter={() => planState.activePlan(props.plan.id)}
        onClick={() => scrollToDay(props.plan.start)}
      >

        {props.plan.description ? (
          <span>{ props.plan.description }</span>
        ) : (
          <span>{workingDays}d ({workingHours}h)</span>
        )}
      </button>

      <button
        className="i-ph:x shrink-0 text-muted transition-colors hover:text-accent"
        onClick={() => planState.deletePlan(props.plan.id)}
      />
    </motion.li>
  )
}
