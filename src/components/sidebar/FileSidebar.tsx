import React, { useState } from 'react'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { useProjectStore } from '../../stores/useProjectStore'
import { useResizable } from '../../hooks/useResizable'
import type { TreeNode } from '../../types'
import styles from './FileSidebar.module.css'

// ── Recursive tree node ──
const FileNode: React.FC<{ node: TreeNode }> = ({ node }) => {
  const { openFileEntry, toggleFolder } = useProjectStore()

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className={styles.folder}
          style={{ paddingLeft: `${10 + node.depth * 12}px` }}
          onClick={() => toggleFolder(node.path)}
        >
          <span className={styles.arrow}>{node.expanded ? '▼' : '▶'}</span>
          <span className={styles.folderIcon}>📁</span>
          <span className={styles.name}>{node.name.toUpperCase()}</span>
        </div>
        {node.expanded && node.children.map((c) => (
          <FileNode key={c.path} node={c} />
        ))}
      </div>
    )
  }

  const ext = node.name.split('.').pop() ?? ''
  const iconMap: Record<string, { icon: string; color: string }> = {
    json: { icon: '{}', color: 'var(--p)' },
    js:   { icon: 'JS', color: '#f0db4f' },
    ts:   { icon: 'TS', color: '#3178c6' },
    tsx:  { icon: 'TSX',color: '#3178c6' },
    jsx:  { icon: 'JSX',color: '#61dafb' },
    css:  { icon: 'CSS',color: '#4fc0e8' },
    md:   { icon: 'MD', color: 'var(--g)' },
  }
  const fi = iconMap[ext] ?? { icon: '📄', color: 'var(--txt2)' }

  return (
    <div
      className={styles.file}
      style={{ paddingLeft: `${22 + node.depth * 12}px` }}
      onClick={() => openFileEntry(node)}
    >
      <span className={styles.fileIcon} style={{ color: fi.color, fontSize: '10px' }}>{fi.icon}</span>
      <span className={styles.name}>{node.name.toUpperCase()}</span>
    </div>
  )
}

// ── Main component ──
export const FileSidebar: React.FC = () => {
  const sidebarWidth = useLayoutStore((s) => s.sidebarWidth)
  const { fileTree, selectRoot, rootHandle, createFile, createFolder } = useProjectStore()
  const { onMouseDown } = useResizable()
  const [newItemMode, setNewItemMode] = useState<'file' | 'folder' | null>(null)
  const [newItemName, setNewItemName] = useState('')

  const handleCreate = async () => {
    if (!newItemName.trim()) { setNewItemMode(null); return }
    if (newItemMode === 'file') await createFile(newItemName.trim())
    else await createFolder(newItemName.trim())
    setNewItemName('')
    setNewItemMode(null)
  }

  return (
    <div className={styles.sidebar} style={{ width: sidebarWidth }}>
      {/* Header with action icons ⑤ */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>{rootHandle?.name?.toUpperCase() ?? 'PROJECT_ROOT'}</span>
        <div className={styles.headerIcons}>
          <button
            className={styles.headerIcon}
            title="フォルダを開く"
            onClick={selectRoot}
          >📂</button>
          <button
            className={styles.headerIcon}
            title="新規フォルダ"
            onClick={() => { setNewItemMode('folder'); setNewItemName('') }}
          >📁</button>
          <button
            className={styles.headerIcon}
            title="新規ファイル"
            onClick={() => { setNewItemMode('file'); setNewItemName('') }}
          >📄</button>
        </div>
      </div>

      {/* Inline new-item input */}
      {newItemMode && (
        <div className={styles.newItemRow}>
          <span className={styles.newItemIcon}>{newItemMode === 'file' ? '📄' : '📁'}</span>
          <input
            className={styles.newItemInput}
            autoFocus
            placeholder={newItemMode === 'file' ? 'filename.json' : 'folder-name'}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') setNewItemMode(null)
            }}
          />
        </div>
      )}

      {/* File tree */}
      <div className={styles.tree}>
        {fileTree.length === 0 ? (
          <div className={styles.empty}>
            <button className={styles.openFolderBtn} onClick={selectRoot}>
              📂 フォルダを開く
            </button>
            <p className={styles.emptyHint}>ローカルのフォルダを選択してください</p>
          </div>
        ) : (
          fileTree.map((n) => <FileNode key={n.path} node={n} />)
        )}
      </div>

      {/* ResizeHandle ⑤ — 右端ドラッグで幅調整 */}
      <div className={styles.resizeHandle} onMouseDown={onMouseDown} />
    </div>
  )
}
