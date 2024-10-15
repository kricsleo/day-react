import { useTheme } from '../hooks/theme'

export default function Theme() {
  const themeState = useTheme()

  const transform = themeState.theme === 'dark' ? 'translateY(0)' : 'translateY(-32px)'

  return (
    <button
      onClick={themeState.toggleTheme}
      className="wh-32 absolute left-50% top-50% x-center translate--50% of-hidden border rounded-full bg-background p-sm py-6"
    >
      <div className="flex flex-col gap-md transition-transform transition-duration-300" style={{ transform }}>
        <i className="i-ph:moon-stars" />
        <i className="i-ph:sun-dim" />
      </div>
    </button>
  )
}
