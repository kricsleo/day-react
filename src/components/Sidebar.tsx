import { scrollToDay } from '../utils/scroll'
import Hours from './Hours'
import Minimap from './Minimap'
import Theme from './Theme'

export default function Sidebar() {
  const today = new Date()
  const month = today.getMonth() + 1
  const date = today.getDate()

  return (
    <aside className="w-200 flex flex-col items-start gap-xl p-xl pt-48">

      <Minimap />

      <div className="relative mt-auto self-stretch">
        <hr className="my-xs h-1 bg-muted" />
        <Theme />
      </div>

      <button
        className="center rounded-sm bg-secondary px-md py-xs text-primary text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
        onClick={() => scrollToDay(new Date())}
        title="滚动日期到今日"
      >
        <i className="i-ph:calendar-dot mr-sm" />
        <span className="ws-nowrap text-lg">{month}月{date}</span>
        <span className="ws-nowrap text-sm">&nbsp;(今日)</span>
      </button>

      <Hours />

    </aside>
  )
}
