import { useEffect } from 'react'
import { useEditorStore } from '../stores/useEditorStore'
import { useProjectStore } from '../stores/useProjectStore'
import { useShortcutFooterStore } from '../stores/useShortcutFooterStore'

export function useShortcut() {
  const { nextMatch, prevMatch } = useEditorStore()
  const { saveActiveFile } = useProjectStore()
  const { toggle, rooms, activeRoomId } = useShortcutFooterStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      
      // Ctrl+S
      if (ctrl && e.key === 's') {
        e.preventDefault()
        saveActiveFile()
        return
      }

      // Alt+B to toggle footer
      if (e.altKey && e.key.toLowerCase() === 'b' && !ctrl && !e.shiftKey) {
        e.preventDefault()
        toggle()
        return
      }

      // Alt+<Key> for shortcuts
      if (e.altKey && !ctrl && !e.shiftKey) {
        const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0]
        if (!activeRoom) return

        const keyChar = e.key.toLowerCase()
        const wordToInsert = activeRoom.items[keyChar]

        if (wordToInsert) {
          e.preventDefault()
          e.stopPropagation();

          // Try to insert text at cursor using execCommand
          // This works for native inputs and Monaco's hidden textarea
          const success = document.execCommand('insertText', false, wordToInsert)
          
          if (!success) {
            // Fallback for some native inputs if execCommand is fully disabled
            const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement
            if (activeEl && ('selectionStart' in activeEl)) {
              const start = activeEl.selectionStart || 0
              const end = activeEl.selectionEnd || 0
              const currentVal = activeEl.value
              activeEl.value = currentVal.substring(0, start) + wordToInsert + currentVal.substring(end)
              activeEl.selectionStart = activeEl.selectionEnd = start + wordToInsert.length
              activeEl.dispatchEvent(new Event('input', { bubbles: true }))
            }
          }
        }
      }
    }
    window.addEventListener('keydown', handler, true) // use capture phase to override Monaco
    return () => window.removeEventListener('keydown', handler, true)
  }, [nextMatch, prevMatch, saveActiveFile, toggle, rooms, activeRoomId])
}
