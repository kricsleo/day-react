import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useTheme = create(persist<ThemeState>(set => ({
  theme: 'auto',
  setTheme: theme => {
    set({ theme })
    document.documentElement.classList.add(theme)
  },
}), {
  name: 'theme',
}))

export function initTheme() {

}

export function setTheme(theme: Theme) {
  document.documentElement.classList.add(theme)
}
