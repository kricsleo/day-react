import { getDateId } from '../hooks/days'

export function scrollToDay(date: Date) {
  const dayId = getDateId(date)
  const targetDom = document.getElementById(dayId)?.parentElement!.parentElement!
    .previousElementSibling
    ?.previousElementSibling
  if (!targetDom) {
    console.error('Failed to scroll to day:', date)
    return
  }
  targetDom.scrollIntoView({ block: 'start', behavior: 'smooth' })
}
