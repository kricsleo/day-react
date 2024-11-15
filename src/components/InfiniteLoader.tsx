import type { RefObject } from 'react'
import { observerManager } from '@kricsleo/observer'
import { useEffect, useRef } from 'react'

export default function InfiniteLoader(props: {
  name: string
  container: RefObject<Element>
  onLoad: () => void
}) {
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!domRef.current) {
      return
    }

    observerManager.registerObserver('loader', {
      root: props.container.current,
    })
    observerManager.observe('loader', domRef.current, props.onLoad)

    return () => observerManager.deleteObserver('loader')
  }, [])

  return (
    <div ref={domRef} className="h-0.5" />
  )
}
