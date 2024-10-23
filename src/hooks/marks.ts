import { create } from 'zustand'
import { combine, persist, subscribeWithSelector } from 'zustand/middleware'
import { uuid } from '../utils/utils'
import { type Color, pickColor } from './colors'

export interface Mark {
  id: string
  dayId: string
  color: Color
  description: string
}

export const useMarkState = create(persist(subscribeWithSelector(combine({
  marks: [] as Mark[],

  editingMarkId: null as string | null,

}, (set, get) => ({
  addMark: (dayId: string) => {
    const mark = createMark(dayId)
    set(state => ({ marks: [...state.marks, mark] }))
    return mark
  },

  deleteMark: (markId: string) => {
    set(state => ({ marks: state.marks.filter(mark => mark.id !== markId) }))
  },

  updateMark: (markId: string, mark: Partial<Mark>) => {
    set(state => ({
      marks: state.marks.map(m => (m.id === markId ? { ...m, ...mark } : m)),
    }))
  },

  editMark: (markId: string) => set({ editingMarkId: markId }),

  cancelEditMark: () => set({ editingMarkId: null }),

  updateEditingMark: (dayId: string) => {
    const { editingMarkId, marks } = get()
    if (!editingMarkId) {
      return
    }
    const mark = marks.find(m => m.id === editingMarkId)
    if (!mark || mark.dayId === dayId) {
      return
    }
    set(state => ({
      marks: state.marks.map(mark => {
        if (mark.id === state.editingMarkId) {
          return { ...mark, dayId }
        }
        return mark
      }),
    }))
  },
}))), {
  name: 'marks/v3',
}))

useMarkState.subscribe(state => state.editingMarkId, editingMarkId => {
  document.body.style.cursor = editingMarkId ? 'grabbing' : ''
})

function createMark(dayId: string): Mark {
  return {
    id: uuid(),
    dayId,
    color: pickColor(),
    description: '',
  }
}
