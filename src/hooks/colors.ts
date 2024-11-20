import { colors as colorPalette } from '@unocss/preset-mini/colors'
import { useTheme } from './theme'

const colors = [
  'red',
  'pink',
  'rose',
  // 'orange',
  // 'amber',
  // 'yellow',
  // 'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'neutral',
] satisfies Array<keyof typeof colorPalette>

export type Color = typeof colors[number]

export function useColorVariant() {
  const theme = useTheme(state => state.theme)
  return theme === 'dark' ? '500' : '400'
}

export function useColorValue(color: Color) {
  const variant = useColorVariant()
  return colorPalette[color][variant]
}

export function useColors() {
  const variant = useColorVariant()
  return colors.map(color => ({ color, value: colorPalette[color][variant] }))
}

export function pickColor() {
  // Random color, except the `neutral` color
  return colors[Math.floor(Math.random() * (colors.length - 1))]!
}
