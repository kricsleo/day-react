import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { uuid } from '../utils/utils'

export interface Mark {
  id: string
  dayId: string
  description: string
}

interface MarkState {
  marks: Mark[]
  addMark: (dayId: string) => Mark
  deleteMark: (id: string) => void
  updateMark: (id: string, mark: Partial<Mark>) => void

  editingMarkId: string | null
  editMark: (markId: string) => void
  cancelEditMark: () => void
  updateEditingMark: (dayId: string) => void
}

export const useMarkState = create(subscribeWithSelector<MarkState>((set, get) => ({
  marks: [],
  addMark(dayId: string) {
    const mark = createMark(dayId)
    set(state => ({ marks: [...state.marks, mark] }))
    return mark
  },
  deleteMark(id) {
    set(state => ({ marks: state.marks.filter(mark => mark.id !== id) }))
  },
  updateMark(id, mark) {
    set(state => ({
      marks: state.marks.map(m => (m.id === id ? { ...m, ...mark } : m)),
    }))
  },

  editingMarkId: null,
  editMark(markId) {
    set({ editingMarkId: markId })
  },
  cancelEditMark() {
    set({ editingMarkId: null })
  },
  updateEditingMark(dayId) {
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
})))

useMarkState.subscribe(state => state.editingMarkId, editingMarkId => {
  document.body.style.cursor = editingMarkId ? 'grabbing' : ''
})

function createMark(dayId: string): Mark {
  return {
    id: uuid(),
    dayId,
    description: '',
  }
}
