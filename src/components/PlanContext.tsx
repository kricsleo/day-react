import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { usePlanContextState } from '../hooks/planContext'
import { usePlanState } from '../hooks/plans'
import { isEnterKey, isEscKey } from '../utils/events'
import { pick } from '../utils/utils'
import ColorPalette from './ColorPalette'
import Context from './Context'

export default function PlanContext() {
  const planContextState = usePlanContextState()

  const planState = usePlanState(useShallow(state => ({
    plan: state.plans.find(plan => plan.id === planContextState.planId),
    ...pick(state, ['deletePlan', 'updatePlan']),
  })))

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEscKey(e)) {
        planContextState.close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  function handleDeletePlan() {
    planContextState.close()

    if (!planState.plan) {
      return
    }
    planState.deletePlan(planState.plan.id)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isEnterKey(e)) {
      planContextState.close()
    }
  }

  return (
    <Context
      name="plan-context"
      opened={Boolean(planContextState.planRowId)}
      portalDomId={planContextState.planRowId}
      style={planContextState.style}
      onClose={planContextState.close}
    >
      { planState.plan ? (
        <>
          <input
            autoFocus={!planState.plan.description}
            className="w-full px-sm py-xs"
            placeholder="添加计划名称..."
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
        </>
      ) : null}
    </Context>
  )
}
