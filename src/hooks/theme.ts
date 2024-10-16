import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: (theme?: Theme) => void
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: localStorage.getItem('theme') as Theme
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  toggleTheme: (_theme?: Theme) => {
    const theme = _theme || (get().theme === 'dark' ? 'light' : 'dark')
    console.log('theme', theme)
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

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const theme = e.matches ? 'dark' : 'light'
  useTheme.getState().toggleTheme(theme)
})
