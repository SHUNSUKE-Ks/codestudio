import React, { useState, useEffect, useRef } from 'react'
import { useMemoStore } from '../../../stores/useMemoStore'
import { useEditorStore } from '../../../stores/useEditorStore'
import type { Memo } from '../../../types'
import styles from './MemoPanel.module.css'

const MemoItem: React.FC<{ memo: Memo }> = ({ memo }) => {
  const { editMemo, deleteMemo, toggleResolved, jumpToMemo, setActiveMemo } = useMemoStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(memo.content)

  const save = () => { editMemo(memo.id, draft); setEditing(false) }

  return (
    <div className={`${styles.item} ${memo.resolved ? styles.itemResolved : ''}`}>
      <div className={styles.itemHeader}>
        <button className={styles.checkBtn} onClick={() => toggleResolved(memo.id)} title={memo.resolved ? '未対応に戻す' : '完了にする'}>
          {memo.resolved ? '☑' : '☐'}
        </button>
        <button className={styles.pathBtn} onClick={() => { jumpToMemo(memo); setActiveMemo(memo) }} title="該当行にジャンプ">
          {memo.filePath.split('/').pop()}:{memo.line}
        </button>
        <div className={styles.itemActions}>
          <button className={styles.actionBtn} onClick={() => setEditing(!editing)}>✎</button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deleteMemo(memo.id)}>✕</button>
        </div>
      </div>
      {editing ? (
        <div className={styles.editArea}>
          <textarea
            className={styles.editInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') save()
              if (e.key === 'Escape') setEditing(false)
            }}
            autoFocus
          />
          <div className={styles.editHint}>Ctrl+Enter 保存 / Esc キャンセル</div>
        </div>
      ) : (
        <div className={styles.content}>{memo.content}</div>
      )}
    </div>
  )
}

export const MemoPanel: React.FC = () => {
  const { selectedLine, filterMode, setFilterMode, addMemo, getMemosForFile, getUnresolvedCount } = useMemoStore()
  const { activeFile } = useEditorStore()
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ⑥ selectedLine が変わったら即入力状態に
  useEffect(() => {
    if (selectedLine !== null) {
      setDraft('')
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [selectedLine])

  const handleSave = async () => {
    if (!activeFile || selectedLine === null || !draft.trim()) return
    await addMemo(activeFile.path, selectedLine, draft.trim())
    setDraft('')
  }

  const fileMemos = activeFile ? getMemosForFile(activeFile.path) : []
  const unresolvedCount = getUnresolvedCount()

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>MEMO</span>
        {unresolvedCount > 0 && <span className={styles.badge}>{unresolvedCount}</span>}
        <div className={styles.filter}>
          <button className={`${styles.filterBtn} ${filterMode === 'all' ? styles.filterActive : ''}`} onClick={() => setFilterMode('all')}>ALL</button>
          <button className={`${styles.filterBtn} ${filterMode === 'unresolved' ? styles.filterActive : ''}`} onClick={() => setFilterMode('unresolved')}>未対応</button>
        </div>
      </div>

      {selectedLine !== null && activeFile ? (
        <div className={styles.newMemo}>
          <div className={styles.newMemoPath}>
            {activeFile.path}:<span className={styles.lineNum}>{selectedLine}</span>
          </div>
          <textarea
            ref={textareaRef}
            className={styles.newMemoInput}
            placeholder="メモを入力… (Ctrl+Enter で保存)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); handleSave() }
              if (e.key === 'Escape') setDraft('')
            }}
            rows={3}
          />
          <div className={styles.newMemoActions}>
            <span className={styles.newMemoHint}>Ctrl+Enter 保存</span>
            <button className={styles.saveBtn} onClick={handleSave}>保存</button>
          </div>
        </div>
      ) : (
        <div className={styles.selectHint}>行番号をクリックするとメモを追加できます</div>
      )}

      <div className={styles.list}>
        {fileMemos.length === 0 ? (
          <div className={styles.empty}>このファイルにメモはありません</div>
        ) : (
          fileMemos.map((m: Memo) => <MemoItem key={m.id} memo={m} />)
        )}
      </div>
    </div>
  )
}
