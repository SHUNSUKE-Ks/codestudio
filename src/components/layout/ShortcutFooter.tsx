import React, { useState, useRef } from 'react'
import { useShortcutFooterStore } from '../../stores/useShortcutFooterStore'
import styles from './ShortcutFooter.module.css'

/* ── Layout: 4 rows matching a physical keyboard ────────────────────────── */
const keyboardRows: string[][] = [
  ['1','2','3','4','5','6','7','8','9','0'],          // Row 1: Numbers
  ['q','w','e','r','t','y','u','i','o','p'],          // Row 2: QWERTY
  ['a','s','d','f','g','h','j','k','l'],              // Row 3: ASDF
  ['z','x','c','v','b','n','m'],                      // Row 4: ZXCV
]

/* ── Single key + input pair ───────────────────────────────────────────── */
const KeyCell: React.FC<{
  keyChar: string
  value: string
  onChange: (v: string) => void
}> = ({ keyChar, value, onChange }) => (
  <div className={styles.keyCell}>
    <div className={styles.keyIndicator}>
      {keyChar}
    </div>
    <div className={styles.inputWrapper}>
      <input
        className={styles.keyInput}
        placeholder="Insert phrase..."
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className={styles.editIconContainer}>
        <span className={`material-symbols-outlined ${styles.editIcon}`}>edit_note</span>
      </button>
    </div>
  </div>
)

/* ── Main Footer Component ─────────────────────────────────────────────── */
export const ShortcutFooter: React.FC = () => {
  const {
    isOpen, rooms, activeRoomId,
    addRoom, setActiveRoom, updateShortcut, importJSON, exportJSON,
  } = useShortcutFooterStore()

  const [newRoomName, setNewRoomName] = useState('')
  const [isAddingRoom, setIsAddingRoom] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0]
  if (!activeRoom) return null

  /* ── handlers ──────────────────────────────────────────────────────── */
  const handleExport = () => {
    const jsonStr = exportJSON()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'codestudio-shortcuts.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target?.result as string
      importJSON(content)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRoomName.trim()) {
      addRoom(newRoomName.trim())
      setNewRoomName('')
      setIsAddingRoom(false)
    }
  }

  return (
    <div className={styles.footerOverlay}>

      {/* ── Header / Room tabs ──────────────────────────────────────── */}
      <nav className={styles.navBar}>
        <div className={styles.navLeft}>
          <span className={styles.navTitle}>
            Editorial Utility
          </span>
          <div className={styles.tabs}>
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`${styles.tabBtn} ${activeRoom.id === room.id ? styles.tabBtnActive : styles.tabBtnInactive}`}
              >
                {room.name}
              </button>
            ))}

            {isAddingRoom ? (
              <form onSubmit={handleAddRoomSubmit} style={{ display: 'flex' }}>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="New space..."
                  className={styles.addInput}
                  autoFocus
                  onBlur={() => { if (!newRoomName.trim()) setIsAddingRoom(false) }}
                />
              </form>
            ) : (
              <button onClick={() => setIsAddingRoom(true)} className={styles.addBtn}>
                <span className={styles.addIconText}>+</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Import / Export ───────────────────────────────────────── */}
        <div className={styles.navRight}>
          <input type="file" accept="application/json" ref={fileInputRef} onChange={handleImport} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} className={styles.actionBtn}>
            <span className={`material-symbols-outlined ${styles.actionIcon}`}>upload_file</span>
            <span className={styles.actionLabel}>JSON Import</span>
          </button>
          <button onClick={handleExport} className={styles.actionBtn}>
            <span className={`material-symbols-outlined ${styles.actionIcon}`}>download</span>
            <span className={styles.actionLabel}>JSON Export</span>
          </button>
        </div>
      </nav>

      {/* ── Keyboard shortcut grid ──────────────────────────────────── */}
      <footer className={styles.keyboardArea}>
        <div className={styles.scrollContainer}>
          <div className={styles.gridContainer}>
            {keyboardRows.map((row, rowIdx) => (
              <div key={rowIdx} className={styles.keyboardRow}>
                {row.map(keyChar => (
                  <KeyCell
                    key={keyChar}
                    keyChar={keyChar}
                    value={activeRoom.items[keyChar] || ''}
                    onChange={(v) => updateShortcut(activeRoom.id, keyChar, v)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
