import { useCallback, useRef } from 'react'
import { useLayoutStore } from '../stores/useLayoutStore'

export function useResizable() {
  const setSidebarWidth = useLayoutStore((s) => s.setSidebarWidth)
  const dragging = useRef(false)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      const startX = e.clientX
      const startW = useLayoutStore.getState().sidebarWidth

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return
        setSidebarWidth(startW + ev.clientX - startX)
      }
      const onUp = () => {
        dragging.current = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [setSidebarWidth]
  )

  return { onMouseDown }
}
