export default function WeekHeaders() {
  const weeks = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  return (
    <ul className="grid cols-7 border-b">
      {weeks.map((week, idx) => (
        <li className="py-12 text-center text-sm text-muted" key={idx}>{week}</li>
      ))}
    </ul>
  )
}
