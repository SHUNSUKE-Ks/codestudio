import React from 'react'
import { useEditorStore }  from '../../stores/useEditorStore'
import { useProjectStore } from '../../stores/useProjectStore'
import styles from './FooterStatusBar.module.css'

export const FooterStatusBar: React.FC = () => {
  const { activeFile, cursorPosition, isDirty } = useEditorStore()
  const { rootHandle, saveActiveFile } = useProjectStore()

  return (
    <footer className={styles.footer}>
      {/* Left */}
      <div className={styles.left}>
        <span className={styles.branch}>⑂ {rootHandle?.name ?? 'No Folder'}</span>
        {isDirty && (
          <button className={styles.saveHint} onClick={saveActiveFile} title="Ctrl+S で保存">
            ● 未保存
          </button>
        )}
      </div>

      {/* Right */}
      <div className={styles.right}>
        <span title="行:列">
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
        <span>UTF-8</span>
        <span>{activeFile?.language?.toUpperCase() ?? '—'}</span>
      </div>
    </footer>
  )
}
