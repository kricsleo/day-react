import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: localStorage.getItem('theme') as Theme || 'dark',
  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    const isDark = theme === 'dark'

    if ('startViewTransition' in document) {
      const transition = document.startViewTransition(updateTheme)
      transition.ready.then(() => {
        const clipPath = [
          `polygon(100% 100%, 100% 100%, 100% 100%)`,
          `polygon(100% 100%, -100% 100%, 100% -100%)`,
        ]
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 300,
            easing: 'ease-in',
            pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
          },
        )
      })
    } else {
      updateTheme()
    }

    function updateTheme() {
      set({ theme })
      document.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('theme', theme)
    }
  },
}))
