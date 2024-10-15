import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  isBefore,
  isSameDay,
  isWithinInterval,
  max,
  min,
} from 'date-fns'
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'
import { type Color, pickColor } from './colors'

export interface Plan {
  id: string
  order: number
  start: Date
  end: Date
  description: string
  color: Color
}

type EditingType = 'start' | 'end' | 'range'

interface PlanState {
  plans: Plan[]
  createPlan: (start: Date) => Plan
  updatePlan: (planId: string, plan: Partial<Plan>) => void
  deletePlan: (planId: string) => void

  editingPlanId: string | null
  editingType: EditingType | null
  editingDirection: 'before' | 'after' | null
  editingArchorDate: Date | null
  editPlan: (planId: string, editingType: EditingType, date: Date) => void
  cancelEditPlan: () => void
  updateEditingPlanDate: (date: Date) => void

  activePlanId: string | null
  activePlan: (planId: string) => void
  deactivePlan: () => void
}

export const usePlanState = create(devtools(subscribeWithSelector<PlanState>((set, get) => ({
  plans: [],
  createPlan(start: Date) {
    const plan = createPlan(start)
    const plans = sortPlans([...get().plans, plan])
    set({ plans })
    return plan
  },
  updatePlan(planId: string, plan: Partial<Plan>) {
    const plans = get().plans.map(p => (p.id === planId ? { ...p, ...plan } : p))
    set({ plans })
  },
  deletePlan(planId: string) {
    const plans = sortPlans(get().plans.filter(p => p.id !== planId))
    set({ plans })
  },

  editingPlanId: null,
  editingType: null,
  editingDirection: null,
  editingArchorDate: null,
  editPlan(planId: string, editingType: EditingType, date: Date) {
    const { plans } = get()
    const plan = plans.find(p => p.id === planId)!
    const editingArchorDate = editingType === 'start' ? plan.end
      : editingType === 'end' ? plan.start
        : editingType === 'range' ? date
          : date

    set({ editingPlanId: planId, editingType, editingDirection: null, editingArchorDate })
  },
  cancelEditPlan() {
    set({ editingPlanId: null, editingType: null, editingDirection: null, editingArchorDate: null })
  },
  updateEditingPlanDate(nextArchorDate: Date) {
    const { plans, editingPlanId, editingType, editingArchorDate: editingPlanArchorDate } = get()
    const plan = plans.find(p => p.id === editingPlanId)

    if (!plan || !editingPlanArchorDate || isSameDay(editingPlanArchorDate, nextArchorDate)) {
      return
    }

    if (editingType === 'range') {
      const offsets = differenceInDays(nextArchorDate, editingPlanArchorDate)
      const editingDirection = offsets > 0 ? 'after' : 'before'

      const start = addDays(plan.start, offsets)
      const end = addDays(plan.end, offsets)
      const nextPlans = sortPlans(plans.map(p =>
        p.id === editingPlanId ? { ...p, start, end } : p,
      ))

      set({ plans: nextPlans, editingArchorDate: nextArchorDate, editingDirection })
    } else {
      const start = min([nextArchorDate, editingPlanArchorDate])
      const end = max([nextArchorDate, editingPlanArchorDate])
      const editingDirection = isBefore(start, plan.start) || isBefore(end, plan.end) ? 'before' : 'after'

      const nextPlans = sortPlans(plans.map(p =>
        p.id === editingPlanId ? { ...p, start, end } : p,
      ))

      set({ plans: nextPlans, editingDirection })
    }
  },

  activePlanId: null,
  activePlan(planId: string) {
    set({ activePlanId: planId })
  },
  deactivePlan() {
    set({ activePlanId: null })
  },
}))))

usePlanState.subscribe(state => [state.editingPlanId, state.editingType], ([editingPlanId, editingType]) => {
  if (!editingPlanId || !editingType) {
    document.body.style.cursor = ''
  } else {
    document.body.style.cursor = editingType === 'range' ? 'grabbing' : 'ew-resize'
  }
}, { equalityFn: shallow })

function createPlan(start: Date, end?: Date): Plan {
  const id = Math.random().toString(36).slice(2)
  return {
    id,
    order: 0,
    start,
    end: end || start,
    description: '',
    color: pickColor(),
  }
}

function sortPlans(plans: Plan[]): Plan[] {
  return plans.map((plan, idx) => {
    const prevPlans = plans.slice(0, idx)
    const days = eachDayOfInterval(plan)

    const occupiedOrders: boolean[] = []
    days.forEach(day => {
      const plansInCurrentDay = prevPlans.filter(p => isWithinInterval(day, p))
      plansInCurrentDay.forEach(p => occupiedOrders[p.order] = true)
    })

    const avaliableOrder = occupiedOrders.findIndex(order => !order)
    plan.order = avaliableOrder === -1 ? occupiedOrders.length : avaliableOrder

    return plan
  })
}
