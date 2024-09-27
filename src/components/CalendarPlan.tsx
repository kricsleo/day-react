import cls from 'classnames'
import { differenceInDays, isAfter, isBefore } from 'date-fns'
import { usePlanState } from '../hooks/plans'

export default function CalendarPlan(props: {
  planId: string
  startDate: Date
  endDate: Date
}) {
  const plan = usePlanState(state => state.plans.find(plan => plan.id === props.planId)!)
  const hasEditingPlan = usePlanState(state => Boolean(state.editingPlanId))
  const editing = usePlanState(state => state.editingPlanId === props.planId)

  const active = usePlanState(state => state.activePlanId === props.planId)
  const setActive = usePlanState(state => state.active)
  const cancelActive = usePlanState(state => state.cancelActive)

  const includingPlanStart = !isAfter(props.startDate, plan.range[0])
  const includingPlanEnd = !isBefore(props.endDate, plan.range[1])

  const height = 20
  const gap = 4
  const bottom = `${Math.max(plan.order * (height + gap)) + 8}px`

  const left = includingPlanStart
    ? `${differenceInDays(plan.range[0], props.startDate) / 7 * 100}%`
    : '0'
  const right = includingPlanEnd
    ? `calc(${differenceInDays(props.endDate, plan.range[1]) / 7 * 100}% + 12px)`
    : `0`

  return (
    <div
      className={cls('absolute bg-primary transition-all op-45', {
        'rounnded-l': includingPlanStart,
        'rounded-r': includingPlanEnd,
        'pointer-events-none': hasEditingPlan,
        '!op-90': active,
        '!op-100': editing,
      })}
      style={{ height, left, right, bottom }}
      onMouseEnter={() => setActive(plan.id)}
      onMouseLeave={cancelActive}
    />
  )
}
