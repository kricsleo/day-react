import cls from 'classnames'
import { addDays, differenceInDays, isAfter, isBefore } from 'date-fns'
import { useEffect } from 'react'
import { useMouseUp } from '../hooks/events'
import { usePlanState } from '../hooks/plans'

export default function CalendarPlan(props: {
  planId: string
  startDate: Date
  endDate: Date
}) {
  const plan = usePlanState(state => state.plans.find(plan => plan.id === props.planId)!)
  const hasEditingPlan = usePlanState(state => Boolean(state.editingPlanId))
  const editing = usePlanState(state => state.editingPlanId === props.planId)
  const cancelEditingPlan = usePlanState(state => state.cancelEditing)

  const editingPlan = usePlanState(state => state.editing)

  const active = usePlanState(state => state.activePlanId === props.planId)
  const setActive = usePlanState(state => state.active)
  const cancelActive = usePlanState(state => state.cancelActive)

  const includingStart = !isAfter(props.startDate, plan.range[0])
  const includingEnd = !isBefore(props.endDate, plan.range[1])

  const height = 20
  const gap = 4
  const bottom = `${Math.max(plan.order * (height + gap)) + 8}px`

  const left = includingStart
    ? `${differenceInDays(plan.range[0], props.startDate) / 7 * 100}%`
    : '0'
  const right = includingEnd
    ? `calc(${differenceInDays(props.endDate, plan.range[1]) / 7 * 100}% + 12px)`
    : `0`

  useMouseUp(cancelEditingPlan)

  function handlePlanMouseDown(e: React.MouseEvent<HTMLElement>) {
    const parentWidth = e.currentTarget.offsetWidth
    const clickX = e.nativeEvent.offsetX
    const dayOffset = Math.floor((clickX / parentWidth) * 7)
    const currentDate = addDays(props.startDate, dayOffset)
    console.log('currentDate', currentDate)
    editingPlan(plan.id, 'range', currentDate)
  }

  function handlePlanStartMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    editingPlan(plan.id, 'start', plan.range[1])
  }

  function handlePlanEndMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    editingPlan(plan.id, 'end', plan.range[0])
  }

  return (
    <div
      className={cls('absolute bg-primary transition-all op-45', {
        'rounnded-l': includingStart,
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
            'center absolute left-0.5 top-50% text-primary translate--1/2 hover:text-red px-sm py-xs',
          )}
          onMouseDown={handlePlanStartMouseDown}
        >
          <i className="i-ph:arrows-out-line-horizontal-fill" />
        </button>
      )}
      {includingEnd && (
        <button
          className={cls(
            'center absolute right-0.5 top-50% text-primary translate-y--1/2 translate-x-1/2 hover:text-red px-sm py-xs',
          )}
          onMouseDown={handlePlanEndMouseDown}
        >
          <i className="i-ph:arrows-out-line-horizontal-fill" />
        </button>
      )}
    </div>
  )
}
