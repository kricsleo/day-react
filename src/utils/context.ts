export function getContextStyle(e: React.MouseEvent) {
  e.preventDefault()

  const rect = e.currentTarget.getBoundingClientRect()
  const horizontalGap = 20
  const preferLeft = window.innerWidth - e.clientX > 400
  const preferTop = window.innerHeight - e.clientY > 400

  return {
    // top: preferTop ? e.clientY - rect.top : 'auto',
    top: preferTop ? 0 : 'auto',
    left: preferLeft ? e.clientX - rect.left + horizontalGap : 'auto',
    // bottom: preferTop ? 'auto' : rect.bottom - e.clientY,
    bottom: preferTop ? 'auto' : 0,
    right: preferLeft ? 'auto' : rect.right - e.clientX + horizontalGap,
  }
}
