import clsx from 'clsx'
import { type Color, useColors } from '../hooks/colors'

export default function ColorPalette(props: {
  color: Color
  onChange: (color: Color) => void
}) {
  const colors = useColors()

  return (
    <div className="grid grid-cols-6 justify-center gap-md p-xs">
      {colors.map(color => (
        <button
          key={color.value}
          className={clsx(
            'justify-self-center rounded p-sm hover:bg-accent/65 transition-colors',
            { '!bg-accent': props.color === color.color },
          )}
          onClick={e => {
            e.stopPropagation()
            props.onChange(color.color)
          }}
        >
          <div className="h-12 w-12 rounded-full" style={{ backgroundColor: color.value }} />
        </button>
      ))}
    </div>
  )
}
