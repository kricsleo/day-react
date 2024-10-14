import { colors as colorPalette } from '@unocss/preset-mini/colors'
import { useTheme } from './theme'

const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'pink',
  'rose',
] satisfies Array<keyof typeof colorPalette>

export type Color = typeof colors[number]

export function pickColor() {
  return colors[Math.floor(Math.random() * colors.length)]!
}

export function useColorVariant() {
  const theme = useTheme(state => state.theme)
  return theme === 'dark' ? '400' : '500'
}

export function useColorValue(color: Color) {
  const variant = useColorVariant()
  return colorPalette[color][variant]
}

export function useColors() {
  const variant = useColorVariant()
  return colors.map(color => ({ color, value: colorPalette[color][variant] }))
}
