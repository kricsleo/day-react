import { motion } from 'motion/react'
import { type Color, useColors } from '../hooks/colors'

export default function ColorPalette(props: {
  color: Color
  onChange: (color: Color) => void
}) {
  const colors = useColors()

  return (
    <div className="flex flex-wrap justify-center gap-xs p-xs">
      {colors.map(color => (
        <motion.button
          key={color.value}
          className="relative justify-self-center rounded p-sm transition-colors hover:bg-accent/45"
          onClick={e => {
            e.stopPropagation()
            props.onChange(color.color)
          }}
        >
          {props.color === color.color && (
            <motion.div
              layoutId="color-palette-selected"
              className="absolute inset-0 h-full w-full rounded bg-accent"
              transition={{ duration: 0.15 }}
            />
          )}
          <div className="relative z-1 h-12 w-12 rounded-full" style={{ backgroundColor: color.value }} />
        </motion.button>
      ))}
    </div>
  )
}
