import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    set({ theme })

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  },
}))
