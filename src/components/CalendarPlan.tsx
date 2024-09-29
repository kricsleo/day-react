import cls from 'classnames'
import { addDays, differenceInDays, isAfter, isBefore, isSameDay } from 'date-fns'
import { usePlanState } from '../hooks/plans'

export default function CalendarPlan(props: {
  planId: string
  startDate: Date
  endDate: Date
}) {
  const plan = usePlanState(state => state.plans.find(plan => plan.id === props.planId)!)
  const hasEditingPlan = usePlanState(state => Boolean(state.editingPlanId))
  const editing = usePlanState(state => state.editingPlanId === props.planId)
  const editingStart = usePlanState(state => {
    return editing
      && isSameDay(plan.end, state.editingPlanArchorDate!)
      && ['start', 'end'].includes(state.editingType!)
  })
  const editingEnd = usePlanState(state => {
    return editing
      && isSameDay(plan.start, state.editingPlanArchorDate!)
      && ['start', 'end'].includes(state.editingType!)
  })
  const editingPlan = usePlanState(state => state.editing)

  const active = usePlanState(state => state.activePlanId === props.planId)
  const setActive = usePlanState(state => state.active)
  const cancelActive = usePlanState(state => state.cancelActive)

  const includingStart = !isAfter(props.startDate, plan.start)
  const includingEnd = !isBefore(props.endDate, plan.end)

  const height = 20
  const gap = 4
  const bottom = `${Math.max(plan.order * (height + gap)) + 8}px`

  const left = includingStart
    ? `${differenceInDays(plan.start, props.startDate) / 7 * 100}%`
    : '0'
  const right = includingEnd
    ? `calc(${differenceInDays(props.endDate, plan.end) / 7 * 100}% + 12px)`
    : `0`

  function handlePlanMouseDown(e: React.MouseEvent<HTMLElement>) {
    const rowDomRect = e.currentTarget.parentElement!.getBoundingClientRect()
    const dayOffset = Math.floor(((e.pageX - rowDomRect.left) / rowDomRect.width) * 7)
    const currentDate = addDays(props.startDate, dayOffset)
    editingPlan(plan.id, 'range', currentDate)
  }

  function handlePlanStartMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    editingPlan(plan.id, 'start', plan.end)
  }

  function handlePlanEndMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    editingPlan(plan.id, 'end', plan.start)
  }

  return (
    <div
      className={cls('absolute bg-primary transition-all op-45', {
        'rounded-l': includingStart,
        'rounded-r': includingEnd,
        'pointer-events-none': hasEditingPlan,
        '!op-90': active,
        '!op-100': editing,
      })}
      style={{ height, left, right, bottom }}
      onMouseEnter={() => setActive(plan.id)}
      onMouseLeave={cancelActive}
      onMouseDown={handlePlanMouseDown}
    >
      {includingStart && (
        <button
          className={cls(
            'center absolute left-0.5 top-50% text-primary translate--1/2 op-0 hover:op-100 px-sm py-xs',
            {
              'pointer-events-none': hasEditingPlan && !editingStart,
              '!op-100': editingStart,
            },
          )}
          onMouseDown={handlePlanStartMouseDown}
        >
          <i className="i-ph:arrows-out-line-horizontal-fill" />
        </button>
      )}
      {includingEnd && (
        <button
          className={cls(
            'center absolute right-0.5 top-50% text-primary translate-y--1/2 translate-x-1/2 op-0 hover:op-100 px-sm py-xs',
            {
              'pointer-events-none': hasEditingPlan && !editingEnd,
              '!op-100': editingEnd,
            },
          )}
          onMouseDown={handlePlanEndMouseDown}
        >
          <i className="i-ph:arrows-out-line-horizontal-fill" />
        </button>
      )}
    </div>
  )
}
