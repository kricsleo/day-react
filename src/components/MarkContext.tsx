import { useShallow } from 'zustand/shallow'
import { useMarkContextState } from '../hooks/markContext'
import { useMarkState } from '../hooks/marks'
import { isEnterKey } from '../utils/events'
import { pick } from '../utils/utils'
import ColorPalette from './ColorPalette'
import Context from './Context'

export default function MarkContext() {
  const markContextState = useMarkContextState()

  const markState = useMarkState(useShallow(state => ({
    ...pick(state, ['deleteMark', 'updateMark']),
    mark: state.marks.find(mark => mark.id === markContextState.markId),
  })))

  function handleDeleteMark() {
    markContextState.close()

    if (!markState.mark) {
      return
    }
    markState.deleteMark(markState.mark.id)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isEnterKey(e)) {
      markContextState.close()
    }
  }

  return (
    <Context
      name="mark-content"
      opened={Boolean(markContextState.markId)}
      portalDomId={markContextState.markId}
      style={markContextState.style}
      onClose={markContextState.close}
    >
      {markState.mark ? (
        <>
          <input
            autoFocus={!markState.mark.description}
            className="w-full px-sm py-xs"
            placeholder="添加标记名称..."
            value={markState.mark.description}
            onChange={e => markState.updateMark(markState.mark!.id, { description: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          <hr className="mx--xs my-xs h-1 bg-muted" />

          <ColorPalette
            color={markState.mark.color}
            onChange={color => markState.updateMark(markState.mark!.id, { color })}
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
    </Context>
  )
}
