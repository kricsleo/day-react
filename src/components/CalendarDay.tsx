import type { Day } from '../hooks/days'
import clsx from 'clsx'
import { getDate, getMonth } from 'date-fns'
import { motion } from 'framer-motion'
import { useShallow } from 'zustand/shallow'
import { useContextMenuState } from '../hooks/contextMenu'
import { useMarkContextMenuState } from '../hooks/markContextMenu'
import { type Mark, useMarkState } from '../hooks/marks'
import { usePlanState } from '../hooks/plans'
import { isLeftClick } from '../utils/events'
import { pick } from '../utils/utils'

const icons = [
  'i-ph:check-circle-fill',
  'i-ph:calendar-fill',
  'i-ph:clock-fill',
  'i-ph:list-checks-fill',
  'i-ph:note-pencil-fill',
  'i-ph:bookmark-simple-fill',
  'i-ph:flag-fill',
  'i-ph:star-fill',
  'i-ph:bell-fill',
  'i-ph:pushpin-fill',
]

const randomIcon = () => icons[Math.floor(Math.random() * icons.length)]

export default function CalendarDay(props: { day: Day }) {
  const planState = usePlanState(useShallow(state => pick(
    state,
    ['createPlan', 'updateEditingPlanDate', 'editPlan'],
  )))

  const contextMenuState = useContextMenuState(useShallow(state => ({
    close: state.close,
    opened: Boolean(state.planId),
  })))

  const markState = useMarkState(useShallow(state =>
    pick(state, ['addMark', 'editMark', 'updateEditingMark'])),
  )
  const marks = useMarkState(useShallow(state =>
    state.marks.filter(mark => mark.dayId === props.day.id),
  ))

  const openMarkContextMenu = useMarkContextMenuState(state => state.open)

  const date = getDate(props.day.date)
  const month = getMonth(props.day.date) + 1

  function handleMouseDown(e: React.MouseEvent) {
    contextMenuState.close()

    if (!isLeftClick(e) || contextMenuState.opened) {
      return
    }

    const plan = planState.createPlan(props.day.date)
    planState.editPlan(plan.id, 'end', props.day.date)
  }

  function onMouseEnter() {
    planState.updateEditingPlanDate(props.day.date)
    markState.updateEditingMark(props.day.id)
  }

  function handleContextMenu() {
    markState.addMark(props.day.id)
  }

  function handleMarkContextMenu(e: React.MouseEvent, mark: Mark) {
    e.stopPropagation()
    openMarkContextMenu(mark.id, e)
  }

  function handleMarkMouseDown(e: React.MouseEvent, mark: Mark) {
    e.stopPropagation()
    if (!isLeftClick(e)) {
      return
    }

    markState.editMark(mark.id)
  }

  return (
    <div
      id={props.day.id}
      className={clsx('calendar-day relative', {
        'calendar-day--peace': props.day.peace,
      })}
      onMouseDown={handleMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={handleContextMenu}
    >
      <div className="grid grid-cols-3 py-sm">
        <span className={clsx('col-start-2 center px-sm self-start select-none', {
          'bg-primary text-primary rounded-sm': props.day.today,
        })}
        >
          <span className="ws-nowrap text-lg">{month}月{date}</span>
          {props.day.today && <span className="ws-nowrap text-sm">&nbsp;(今日)</span>}
          {props.day.description && <span className="ws-nowrap vertical-baseline text-sm">&nbsp;({props.day.description})</span>}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-md px-sm">
        {marks.map(mark => (
          <motion.span
            key={mark.id}
            layoutId={mark.id}
            transition={{ duration: 0.15 }}
            className={clsx('relative shrink-0 rounded-full text-teal', randomIcon())}
            title={mark.description}
            onMouseDown={e => handleMarkMouseDown(e, mark)}
            onContextMenu={e => handleMarkContextMenu(e, mark)}
          />
        ))}
      </div>
    </div>
  )
}
