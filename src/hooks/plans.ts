import { create } from 'zustand'

interface Plan {
  id: string
  range: [Date, Date]
  description: string
}

interface PlanState {
  plans: Plan[]
  addPlans: (plans: Plan[]) => void
}

export const usePlanState = create<PlanState>(set => ({
  plans: [],
  addPlans: plans => set(state => ({ plans: [...state.plans, ...plans] })),
}))
