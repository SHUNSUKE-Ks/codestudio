import React from 'react'
import wordList from '../../data/wordList.json'
import { useMemoStore } from '../../stores/useMemoStore'
import styles from './WordListPanel.module.css'

const COLOR_MAP: Record<string, string> = {
  p: 'var(--p)', s: 'var(--s)', t: 'var(--t)', g: 'var(--g)',
}

interface WordItem { id: string; label: string; category: string; color: string }

export const WordListPanel: React.FC = () => {
  const { editorRef } = useMemoStore()

  const insertWord = (word: string) => {
    if (!editorRef) return
    const pos = editorRef.getPosition()
    if (!pos) return
    editorRef.executeEdits('word-insert', [{
      range: {
        startLineNumber: pos.lineNumber, startColumn: pos.column,
        endLineNumber: pos.lineNumber, endColumn: pos.column,
      },
      text: `"${word}"`,
    }])
    editorRef.focus()
  }

  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData('text/plain', `"${word}"`)
  }

  const categoryOrder = ['KEY', 'ATTR', 'VOID', 'LIST']
  const grouped = categoryOrder.map((cat) => ({
    cat,
    items: (wordList as WordItem[]).filter((w) => w.category === cat),
  }))

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>WORD LIST</span>
        <span className={styles.hint}>click / drag</span>
      </div>
      <div className={styles.list}>
        {grouped.map(({ cat, items }) => (
          <div key={cat} className={styles.group}>
            <div className={styles.groupLabel}>{cat}</div>
            {items.map((w) => (
              <button
                key={w.id}
                className={styles.wordBtn}
                draggable
                onClick={() => insertWord(w.label)}
                onDragStart={(e) => handleDragStart(e, w.label)}
                title={`クリック or ドラッグで挿入`}
              >
                <span className={styles.wordLabel} style={{ color: COLOR_MAP[w.color] }}>
                  {w.label}
                </span>
                <span className={styles.wordTag} style={{ color: COLOR_MAP[w.color], borderColor: COLOR_MAP[w.color] + '44' }}>
                  {cat}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
