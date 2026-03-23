import React, { useState, useRef, useEffect } from 'react'
import { useEditorStore } from '../../stores/useEditorStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { useProjectStore } from '../../stores/useProjectStore'
import folderTemplates from '../../data/folderTemplates.json'
import type { FolderTemplate } from '../../types'
import styles from './HeaderBar.module.css'

export const HeaderBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const { searchQuery, setSearchQuery, nextMatch, prevMatch } = useEditorStore()
  const { activeMode, setActiveMode } = useLayoutStore()
  const { applyTemplate } = useProjectStore()

  // Ctrl+F を捕捉して SearchBox 表示
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setSearchVisible(true)
        setTimeout(() => searchRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') setSearchVisible(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.shiftKey ? prevMatch() : nextMatch()
    if (e.key === 'Escape') setSearchVisible(false)
  }

  const handleTemplate = async (tpl: FolderTemplate) => {
    await applyTemplate(tpl)
    setMenuOpen(false)
  }

  const modes = [
    { id: 'edit' as const, label: 'EDIT' },
    { id: 'preview' as const, label: 'VIEW' },
    { id: 'schema' as const, label: 'SCHEMA' },
  ]

  return (
    <>
      <header className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⌨</span>
          <span className={styles.logoText}>CODESTUDIO</span>
        </div>

        {/* Mode switcher — 拡張スロット ① */}
        <div className={styles.modeSwitcher}>
          {modes.map((m) => (
            <button
              key={m.id}
              className={`${styles.modeBtn} ${activeMode === m.id ? styles.modeBtnActive : ''}`}
              onClick={() => setActiveMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className={styles.right}>
          {/* SearchBox ② — Ctrl+F で表示 */}
          {searchVisible ? (
            <div className={styles.searchBox}>
              <input
                ref={searchRef}
                className={styles.searchInput}
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKey}
              />
              <button className={styles.searchNav} onClick={prevMatch} title="前へ (↑)">↑</button>
              <button className={styles.searchNav} onClick={nextMatch} title="次へ (↓)">↓</button>
              <button className={styles.searchClose} onClick={() => setSearchVisible(false)}>✕</button>
            </div>
          ) : (
            <button
              className={styles.searchTrigger}
              onClick={() => { setSearchVisible(true); setTimeout(() => searchRef.current?.focus(), 50) }}
            >
              <span className={styles.searchHint}>CTRL+F</span>
              <span className={styles.searchIcon}>⌕</span>
            </button>
          )}

          {/* MoreMenu ③ */}
          <button className={styles.moreBtn} onClick={() => setMenuOpen(true)}>⋮</button>
        </div>
      </header>

      {/* MoreMenu overlay ③ — 画面全体にかぶせるハンバーガーパネル */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.menuHeader}>
              <span className={styles.menuTitle}>SETTINGS</span>
              <button className={styles.menuClose} onClick={() => setMenuOpen(false)}>✕</button>
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuSectionLabel}>FOLDER TEMPLATE</div>
              {(folderTemplates as FolderTemplate[]).map((tpl) => (
                <button key={tpl.id} className={styles.menuItem} onClick={() => handleTemplate(tpl)}>
                  <span className={styles.menuItemIcon}>🗂</span>
                  <span>
                    <span className={styles.menuItemName}>{tpl.name}</span>
                    <span className={styles.menuItemDesc}>{tpl.description}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuSectionLabel}>SHORTCUT REFERENCE</div>
              {[
                ['Ctrl+S', '上書き保存'],
                ['Ctrl+F', 'ファイル内検索'],
                ['↑↓', '検索結果をジャンプ'],
                ['Ctrl+Enter', 'Memo 保存'],
                ['Escape', 'パネルを閉じる'],
              ].map(([k, v]) => (
                <div key={k} className={styles.shortcutRow}>
                  <code className={styles.shortcutKey}>{k}</code>
                  <span className={styles.shortcutDesc}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
