import { useEffect } from 'react'

export function useMouseUp(handler: (e: MouseEvent) => void) {
  useEffect(() => {
    window.addEventListener('mouseup', handler)
    return () => window.removeEventListener('mouseup', handler)
  }, [handler])
}
