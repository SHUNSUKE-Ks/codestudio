import { useEffect } from 'react'
import { useEditorStore } from '../stores/useEditorStore'
import { useProjectStore } from '../stores/useProjectStore'

export function useShortcut() {
  const { nextMatch, prevMatch } = useEditorStore()
  const { saveActiveFile } = useProjectStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 's') {
        e.preventDefault()
        saveActiveFile()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [nextMatch, prevMatch, saveActiveFile])
}
