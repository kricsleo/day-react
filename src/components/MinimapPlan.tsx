import { eachDayOfInterval } from 'date-fns'
import { motion } from 'motion/react'
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

  const opacity = planState.editing || planState.active ? 1 : 0.85
  const backgroundColor = useColorValue(props.plan?.color || pickColor())

  const hoursDescription = `${workingDays}d (${workingHours}h)`
  const title = [hoursDescription, props.plan.description].filter(Boolean).join(': ')
  const description = props.plan.description || hoursDescription

  return (
    <motion.li
      className="y-center gap-sm"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 20, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <button
        className="grow-1 truncate border-l-6 border-accent rounded-xs px-xs text-left text-sm transition-[opacity,colors]"
        style={{ backgroundColor, opacity }}
        onMouseEnter={() => planState.activePlan(props.plan.id)}
        onClick={() => scrollToDay(props.plan.start)}
        title={title}
      >
        {description}
      </button>

      <button
        className="i-ph:x shrink-0 text-muted transition-colors hover:text-accent"
        onClick={() => planState.deletePlan(props.plan.id)}
      />
    </motion.li>
  )
}
