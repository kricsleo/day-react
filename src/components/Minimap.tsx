import { AnimatePresence } from 'motion/react'
import { useShallow } from 'zustand/shallow'
import { usePlanState } from '../hooks/plans'
import MinimapPlan from './MinimapPlan'

export default function Minimap() {
  const plans = usePlanState(useShallow(state => state.plans.slice().reverse()))

  return (
    <ul className="max-h-75vh flex flex-col self-stretch gap-sm of-auto">
      <AnimatePresence>
        {plans.map(plan => (
          <MinimapPlan key={plan.id} plan={plan} />
        ))}
      </AnimatePresence>
    </ul>
  )
}
