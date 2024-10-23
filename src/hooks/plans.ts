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
import { combine, persist, subscribeWithSelector } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'
import { uuid } from '../utils/utils'
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
type EditingDirection = 'before' | 'after'

export const usePlanState = create(persist(subscribeWithSelector(combine({
  plans: [] as Plan[],
  editingPlanId: null as string | null,
  editingType: null as EditingType | null,
  editingDirection: null as EditingDirection | null,
  editingArchorDate: null as Date | null,
  activePlanId: null as string | null,

}, (set, get) => ({
  createPlan: (start: Date) => {
    const plan = createPlan(start)
    const plans = sortPlans([...get().plans, plan])
    set({ plans })
    return plan
  },
  updatePlan: (planId: string, plan: Partial<Plan>) => {
    const plans = get().plans.map(p => (p.id === planId ? { ...p, ...plan } : p))
    set({ plans })
  },
  deletePlan: (planId: string) => {
    const plans = sortPlans(get().plans.filter(p => p.id !== planId))
    set({ plans })
  },

  editPlan(planId: string, editingType: EditingType, date: Date) {
    const { plans } = get()
    const plan = plans.find(p => p.id === planId)!
    const editingArchorDate = editingType === 'start' ? plan.end
      : editingType === 'end' ? plan.start
        : editingType === 'range' ? date
          : date

    set({ editingPlanId: planId, editingType, editingDirection: null, editingArchorDate })
  },
  cancelEditPlan: () => {
    set({ editingPlanId: null, editingType: null, editingDirection: null, editingArchorDate: null })
  },
  updateEditingPlanDate: (nextArchorDate: Date) => {
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

  activePlan: (planId: string) => set({ activePlanId: planId }),
  deactivePlan: () => set({ activePlanId: null }),
}))), {
  name: 'plans/v3',
}))

usePlanState.subscribe(state => [state.editingPlanId, state.editingType], ([editingPlanId, editingType]) => {
  if (!editingPlanId || !editingType) {
    document.body.style.cursor = ''
  } else {
    document.body.style.cursor = editingType === 'range' ? 'grabbing' : 'ew-resize'
  }
}, { equalityFn: shallow })

function createPlan(start: Date, end?: Date): Plan {
  return {
    id: uuid(),
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
