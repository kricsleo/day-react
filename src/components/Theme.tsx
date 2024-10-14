import { motion } from 'framer-motion'
import { useTheme } from '../hooks/theme'

export default function Theme() {
  const themeState = useTheme()

  return (
    <button onClick={themeState.toggleTheme}>
      {themeState.theme === 'dark' ? (
        <motion.i className="i-ph:moon-stars" layoutId="theme-icon" />
      ) : (
        <motion.i className="i-ph:sun-dim ml-67" layoutId="theme-icon" />
      )}
    </button>
  )
}
