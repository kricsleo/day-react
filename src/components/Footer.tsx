import Hours from './Hours'
import Theme from './Theme'

export default function Footer() {
  const today = new Date()
  const month = today.getMonth() + 1
  const date = today.getDate()

  function handleGoToday() {
    const target = document.getElementById('today')!.parentElement!.parentElement!
      .previousElementSibling!.previousElementSibling!
    target.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  return (
    <footer className="flex flex-col items-start justify-center gap-xl p-xl">
      <button
        className="center rounded-sm bg-secondary px-md py-xs text-primary text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
        onClick={handleGoToday}
        title="滚动日期到今日"
      >
        <i className="i-ph:calendar-dot mr-sm" />
        <span className="ws-nowrap text-lg">{month}月{date}</span>
        <span className="ws-nowrap text-sm">&nbsp;(今日)</span>
      </button>

      <Hours />

      <Theme />
    </footer>
  )
}
