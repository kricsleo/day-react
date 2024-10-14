import { motion } from 'framer-motion'
import { useTheme } from '../hooks/theme'

export default function Theme() {
  const themeState = useTheme()

  return (
    <button
      onClick={themeState.toggleTheme}
      className="fixed right-0 top-0 border rounded-bl-full pb-xs pl-sm pt-xs"
    >
      {themeState.theme === 'dark' ? (
        <motion.i className="i-ph:moon-stars" layoutId="theme-icon" />
      ) : (
        <motion.i className="i-ph:sun-dim" layoutId="theme-icon" />
      )}
    </button>
  )
}
