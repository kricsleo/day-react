import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useContextMenuState } from '../hooks/contextMenu'
import { usePlanState } from '../hooks/plans'
import { isEnter, isEsc } from '../utils/events'
import { pick } from '../utils/utils'
import ColorPalette from './ColorPalette'

export default function ContextMenu(props: { rowId: string }) {
  const contextMenuState = useContextMenuState()

  const planState = usePlanState(useShallow(state => ({
    plan: state.plans.find(plan => plan.id === contextMenuState.planId),
    ...pick(state, ['deletePlan', 'updatePlan']),
  })))

  const opened = props.rowId === contextMenuState.rowId

  function handleDeletePlan() {
    contextMenuState.close()

    if (!planState.plan) {
      return
    }
    planState.deletePlan(planState.plan.id)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isEnter(e)) {
      contextMenuState.close()
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEsc(e)) {
        contextMenuState.close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <AnimatePresence>
      { planState.plan && opened ? (
        <motion.div
          layoutId="plan-context-menu"
          className="absolute z-9 w-220 border rounded bg-popover p-xs shadow-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={contextMenuState.style}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          onClick={e => e.stopPropagation()}
        >
          <input
            className="w-full px-sm py-xs text-md"
            placeholder="计划做些什么..."
            value={planState.plan.description}
            onChange={e => planState.updatePlan(planState.plan!.id, { description: e.target.value })}
            onKeyDown={handleKeyDown}
          />

          <hr className="mx--xs my-xs h-1 bg-muted" />

          <ColorPalette
            color={planState.plan.color}
            onChange={color => planState.updatePlan(planState.plan!.id, { color })}
          />

          <hr className="mx--xs my-xs h-1 bg-muted" />

          <button
            className="w-full y-center justify-between rounded-sm px-sm py-6 transition-colors hover:bg-accent hover:text-accent"
            onClick={handleDeletePlan}
          >
            <span>删除</span>
            <i className="i-ph:trash-simple" />
          </button>
        </motion.div>
      ) : null }
    </AnimatePresence>
  )
}
