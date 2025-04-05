import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { pickColor, useColorValue } from '../hooks/colors'
import { useMarkContextState } from '../hooks/markContext'
import { type Mark as TMark, useMarkState } from '../hooks/marks'
import { isLeftMouse } from '../utils/events'
import { pick } from '../utils/utils'

export default function Mark(props: { markId: string }) {
  const markState = useMarkState(useShallow(state => ({
    ...pick(state, ['addMark', 'editMark', 'updateEditingMark']),
    mark: state.marks.find(mark => mark.id === props.markId),
  })))

  const markContextState = useMarkContextState(useShallow(state => pick(state, ['open', 'markId'])))

  const [description, setDescription] = useState(markState.mark?.description)
  useEffect(() => {
    setDescription(markState.mark?.description)
  }, [markContextState.markId])

  const color = useColorValue(markState.mark?.color || pickColor())

  function handleMarkContext(e: React.MouseEvent, mark: TMark) {
    e.stopPropagation()
    markContextState.open(mark.id, e)
  }

  function handleMarkMouseDown(e: React.MouseEvent, mark: TMark) {
    e.stopPropagation()
    if (!isLeftMouse(e)) {
      return
    }

    markState.editMark(mark.id)
  }

  return markState.mark ? (
    <motion.span
      id={props.markId}
      layout="position"
      layoutId={props.markId}
      transition={{ duration: 0.15 }}
      className="relative h-18 max-w-full min-w-18 center shrink-0 cursor-default rounded-full shadow-lg transition-colors"
      onMouseDown={e => handleMarkMouseDown(e, markState.mark!)}
      onContextMenu={e => handleMarkContext(e, markState.mark!)}
      style={{ backgroundColor: color }}
    >
      {description ? (
        <span className="mx-6 truncate text-xs leading-none">{description}</span>
      ) : null }
    </motion.span>
  ) : null
}
