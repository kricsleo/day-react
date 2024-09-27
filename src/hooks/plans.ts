import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  isWithinInterval,
  max,
  min,
} from 'date-fns'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Plan {
  id: string
  order: number
  range: [Date, Date]
  description: string
}

type EditingType = 'start' | 'end' | 'range'

interface PlanState {
  plans: Plan[]
  create: (start: Date) => Plan
  update: (id: string, plan: Partial<Plan>) => void
  delete: (id: string) => void

  editingPlanId: string | null
  editingType: EditingType | null
  editingPlanArchorDate: Date | null
  editing: (id: string, editingType: EditingType, date: Date) => void
  cancelEditing: () => void
  updateEditingPlanDate: (date: Date) => void

  activePlanId: string | null
  active: (id: string) => void
  cancelActive: () => void
}

export const usePlanState = create(devtools<PlanState>((set, get) => ({
  plans: [],

  create(start: Date) {
    const plan = createPlan(start)
    const plans = sortPlans([...get().plans, plan])
    set({ plans })
    return plan
  },
  update(id: string, plan: Partial<Plan>) {
    const plans = get().plans.map(p => (p.id === id ? { ...p, ...plan } : p))
    set({ plans })
  },
  delete(id: string) {
    const plan = get().plans.find(p => p.id === id)
    if (!plan) {
      return
    }
    const plans = sortPlans(get().plans.filter(p => p.id !== id))
    set({ plans })
  },

  editingPlanId: null,
  editingType: null,
  editingPlanArchorDate: null,
  editing(id: string, editingType: EditingType, date: Date) {
    const { plans } = get()
    const plan = plans.find(p => p.id === id)!
    const editingPlanArchorDate = editingType === 'start' ? plan.range[1]
      : editingType === 'end' ? plan.range[0]
        : editingType === 'range' ? date
          : date

    set({ editingPlanId: id, editingType, editingPlanArchorDate })
  },
  cancelEditing() {
    set({ editingPlanId: null, editingType: null, editingPlanArchorDate: null })
  },
  updateEditingPlanDate(date: Date) {
    const { plans, editingPlanId, editingType, editingPlanArchorDate } = get()
    const plan = plans.find(p => p.id === editingPlanId)
    if (!plan || !editingPlanArchorDate) {
      return
    }

    if (editingType === 'range') {
      const offsets = differenceInDays(date, editingPlanArchorDate)
      const start = addDays(plan.range[0], offsets)
      const end = addDays(plan.range[1], offsets)

      const newPlans = sortPlans(plans.map(p =>
        p.id === editingPlanId ? { ...p, range: [start, end] } : p,
      ))

      set({ plans: newPlans, editingPlanArchorDate: date })
    } else {
      const start = min([date, editingPlanArchorDate])
      const end = max([date, editingPlanArchorDate])

      const newPlans = sortPlans(plans.map(p =>
        p.id === editingPlanId ? { ...p, range: [start, end] } : p,
      ))

      set({ plans: newPlans })
    }
  },

  activePlanId: null,
  active(id: string) {
    set({ activePlanId: id })
  },
  cancelActive() {
    set({ activePlanId: null })
  },
})))

function createPlan(start: Date, end?: Date): Plan {
  const id = Math.random().toString(36).slice(2)
  return {
    id,
    order: 0,
    range: [start, end || start],
    description: '',
  }
}

function sortPlans(plans: Plan[]): Plan[] {
  return plans.map((plan, idx) => {
    const prevPlans = plans.slice(0, idx)
    const days = eachDayOfInterval({ start: plan.range[0], end: plan.range[1] })
    const occupiedOrders: boolean[] = []

    days.forEach(day => {
      const plansInCurrentDay = prevPlans.filter(
        p => isWithinInterval(day, { start: p.range[0], end: p.range[1] }),
      )
      plansInCurrentDay.forEach(p => occupiedOrders[p.order] = true)
    })

    const avaliableOrder = occupiedOrders.findIndex(order => !order)
    const order = avaliableOrder === -1 ? occupiedOrders.length : avaliableOrder

    return plan.order === order ? plan : { ...plan, order }
  })
}
