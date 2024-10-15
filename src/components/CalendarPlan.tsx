import cls from 'clsx'
import { addDays, differenceInDays, eachDayOfInterval, isAfter, isBefore, isSameDay } from 'date-fns'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import { pickColor, useColorValue } from '../hooks/colors'
import { useContextMenuState } from '../hooks/contextMenu'
import { useHourState } from '../hooks/hours'
import { usePlanState } from '../hooks/plans'
import { isWorkingDay } from '../utils/chinese-days'
import { isLeftClick } from '../utils/events'
import { pick } from '../utils/utils'

export default function CalendarPlan(props: {
  rowId: string
  planId: string
  startDate: Date
  endDate: Date
}) {
  const planState = usePlanState(useShallow(state => ({
    plan: state.plans.find(plan => plan.id === props.planId),
    hasEditingPlan: Boolean(state.editingPlanId),
    active: state.activePlanId === props.planId,
    editing: state.editingPlanId === props.planId,
    ...pick(state, ['editingDirection', 'editPlan', 'cancelEditPlan', 'activePlan', 'deactivePlan']),
  })))

  const contextMenuState = useContextMenuState(useShallow(state => ({
    opened: Boolean(state.planId),
    ...pick(state, ['planId', 'open', 'close', 'setStyle']),
  })))

  const hoursPerDay = useHourState(state => state.hour)

  const backgroundColor = useColorValue(planState.plan?.color || pickColor())

  const domRef = useRef<HTMLDivElement>(null)

  if (!planState.plan) {
    return null
  }

  const days = eachDayOfInterval({ start: planState.plan.start, end: planState.plan.end })
  const workingDays = days.filter(day => isWorkingDay(day)).length
  const workingHours = workingDays * hoursPerDay

  function handleMouseEnter() {
    if (!contextMenuState.planId) {
      planState.activePlan(props.planId)
    }
    // contextMenuState.close()
  }
  function handleMouseLeave() {
    if (!planState.active || contextMenuState.planId === props.planId) {
      return
    }
    planState.deactivePlan()
  }

  const includingStart = !isAfter(props.startDate, planState.plan.start)
  const includingEnd = !isBefore(props.endDate, planState.plan.end)

  const height = 20
  const gap = 4
  const bottom = `${Math.max(planState.plan.order * (height + gap)) + 8}px`

  const left = includingStart
    ? `${differenceInDays(planState.plan.start, props.startDate) / 7 * 100}%`
    : '0'
  const right = includingEnd
    // Leave a little gap for the end
    ? `${(differenceInDays(props.endDate, planState.plan.end) / 7 + 0.01) * 100}%`
    : `0`

  const opacity = planState.editing || planState.active ? 1 : 0.75
  const initial = planState.editingDirection === 'before'
    ? { left: '100%', right: '0', bottom }
    : planState.editingDirection === 'after'
      ? { left: '0', right: '100%', bottom }
      : { left, right, bottom }
  const animate = { height, left, right, bottom }
  const exit = planState.editingDirection === 'before'
    ? { left: '0%', right: '100%', bottom }
    : planState.editingDirection === 'after'
      ? { left: '100%', right: '0', bottom }
      : { left, right, bottom }
  const style = {
    height,
    left,
    right,
    bottom,
    opacity,
    backgroundColor,
  }

  function handlePlanMouseDown(e: React.MouseEvent) {
    if (!isLeftClick(e)) {
      return
    }
    if (contextMenuState.opened) {
      contextMenuState.close()
      planState.cancelEditPlan()
      planState.deactivePlan()
    } else {
      const rowDomRect = e.currentTarget.parentElement!.getBoundingClientRect()
      const dayOffset = Math.floor(((e.pageX - rowDomRect.left) / rowDomRect.width) * 7)
      const currentDate = addDays(props.startDate, dayOffset)
      planState.editPlan(planState.plan!.id, 'range', currentDate)
    }
  }

  function handlePlanStartMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    planState.editPlan(planState.plan!.id, 'start', planState.plan!.end)
    contextMenuState.close()
  }

  function handlePlanEndMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    planState.editPlan(planState.plan!.id, 'end', planState.plan!.start)
    contextMenuState.close()
  }

  function handleLayoutAnimationStart() {
    // Mark the plan as animating
    domRef.current?.classList.add('calendar-plan--animating')
  }
  function handleLayoutAnimationComplete() {
    domRef.current?.classList.remove('calendar-plan--animating')
  }

  function handlePlanContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()

    const preferRight = e.clientX < window.innerWidth - 500
    const preferBottom = e.clientY < window.innerHeight - 500

    planState.activePlan(props.planId)
    contextMenuState.setStyle({
      top: preferBottom ? `${e.currentTarget.offsetTop}px` : 'auto',
      right: preferRight ? 'auto' : `${e.currentTarget.parentElement!.offsetWidth - e.nativeEvent.offsetX - e.currentTarget.offsetLeft + 20}px`,
      left: preferRight ? `${e.currentTarget.offsetLeft + e.nativeEvent.offsetX + 20}px` : 'auto',
      bottom: preferBottom ? 'auto' : `${e.currentTarget.parentElement!.offsetHeight - e.currentTarget.offsetTop - e.currentTarget.offsetHeight}px`,
    })
    contextMenuState.open(props.planId, props.rowId)
  }

  return (
    <motion.div
      ref={domRef}
      className={cls('y-center absolute transition-[colors,opacity] cursor-move px-xs select-none ws-nowrap truncate', {
        'rounded-l-xs border-l-8 border-accent': includingStart,
        'rounded-r-xs': includingEnd,
        'pointer-events-none': planState.hasEditingPlan,
      })}
      initial={initial}
      animate={animate}
      exit={exit}
      style={style}
      transition={{ duration: 0.15 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handlePlanMouseDown}
      onContextMenu={handlePlanContextMenu}
      onLayoutAnimationStart={handleLayoutAnimationStart}
      onLayoutAnimationComplete={handleLayoutAnimationComplete}
    >
      {includingStart && (
        <>
          <button
            className="absolute left--15 top--25% h-150% w-35 cursor-ew-resize"
            onMouseDown={handlePlanStartMouseDown}
          />
          <span>{workingDays}d ({workingHours}h)</span>
          {planState.plan.description ? (
            <span>: { planState.plan.description }</span>
          ) : null}
        </>
      )}

      {includingEnd && (
        <button
          className="absolute right--15 top--25% h-150% w-35 cursor-ew-resize"
          onMouseDown={handlePlanEndMouseDown}
        />
      )}
      <span></span>
    </motion.div>
  )
}
