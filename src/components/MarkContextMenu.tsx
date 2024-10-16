import { useShallow } from 'zustand/shallow'
import { useDayState } from '../hooks/days'
import { useMarkContextMenuState } from '../hooks/markContextMenu'
import { useMarkState } from '../hooks/marks'
import { isEnter } from '../utils/events'
import { pick } from '../utils/utils'
import ContextMenu from './ContextMenu'

export default function MarkContextMenu() {
  const markContextMenuState = useMarkContextMenuState()

  const markState = useMarkState(useShallow(state => ({
    ...pick(state, ['deleteMark', 'updateMark']),
    mark: state.marks.find(mark => mark.id === markContextMenuState.markId),
  })))

  const dayId = useDayState(state => state.days.find(day => day.id === markState.mark?.dayId)?.id)

  const opened = Boolean(markContextMenuState.markId)

  function handleDeleteMark() {
    markContextMenuState.close()

    if (!markState.mark) {
      return
    }
    markState.deleteMark(markState.mark.id)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isEnter(e)) {
      markContextMenuState.close()
    }
  }

  return (
    <ContextMenu
      name="mark-content-menu"
      portalDomId={dayId}
      style={markContextMenuState.style}
      opened={opened}
      onClose={markContextMenuState.close}
    >
      {markState.mark ? (
        <>
          <input
            autoFocus={!markState.mark.description}
            className="w-full px-sm py-xs text-md"
            placeholder="标记..."
            value={markState.mark.description}
            onChange={e => markState.updateMark(markState.mark!.id, { description: e.target.value })}
            onKeyDown={handleKeyDown}
          />

          <hr className="mx--xs my-xs h-1 bg-muted" />

          <button
            className="w-full y-center justify-between rounded-sm px-sm py-6 transition-colors hover:bg-accent hover:text-accent"
            onClick={handleDeleteMark}
          >
            <span>删除</span>
            <i className="i-ph:trash-simple" />
          </button>
        </>
      ) : null}
    </ContextMenu>
  )
}
