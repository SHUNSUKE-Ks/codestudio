import React, { useRef, useCallback } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { useEditorStore } from '../../stores/useEditorStore'
import { useMemoStore } from '../../stores/useMemoStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { useProjectStore } from '../../stores/useProjectStore'
import styles from './EditorArea.module.css'

const TabBar: React.FC = () => {
  const { openFiles, activeFile, closeFile, setActive, isDirty } = useEditorStore()
  return (
    <div className={styles.tabs}>
      {openFiles.map((f) => (
        <div
          key={f.path}
          className={`${styles.tab} ${activeFile?.path === f.path ? styles.tabActive : ''}`}
          onClick={() => setActive(f.path)}
        >
          <span className={styles.tabLang}>{f.language === 'json' ? '{}' : f.language.slice(0, 2).toUpperCase()}</span>
          <span className={styles.tabName}>{f.name}</span>
          {activeFile?.path === f.path && isDirty && <span className={styles.tabDirty}>●</span>}
          <button className={styles.tabClose} onClick={(e) => { e.stopPropagation(); closeFile(f.path) }}>✕</button>
        </div>
      ))}
    </div>
  )
}

export const EditorArea: React.FC = () => {
  const editorRef = useRef<any>(null)
  const { activeFile, updateContent, setCursor } = useEditorStore()
  const { setSelectedLine, setEditorRef } = useMemoStore()
  const { setActivePanel } = useLayoutStore()
  const { saveActiveFile } = useProjectStore()

  const handleMount = useCallback((edInstance: any) => {
    editorRef.current = edInstance
    setEditorRef(edInstance)

    // ⑦ 行番号クリック → Memo に行番号を渡す ⑥
    edInstance.onMouseDown((e: any) => {
      if (e.target.type === 4) {
        const line = e.target.position?.lineNumber
        if (line !== undefined) {
          setSelectedLine(line)
          setActivePanel('memo')
        }
      }
    })

    edInstance.onDidChangeCursorPosition((e: any) => {
      setCursor(e.position.lineNumber, e.position.column)
    })

    // Ctrl+S 上書き保存
    edInstance.addCommand(2048 + 49, () => saveActiveFile())
  }, [setEditorRef, setSelectedLine, setActivePanel, setCursor, saveActiveFile])

  const handleChange = useCallback((value: string | undefined) => {
    if (activeFile && value !== undefined) updateContent(activeFile.path, value)
  }, [activeFile, updateContent])

  return (
    <div className={styles.editorArea}>
      <TabBar />
      {activeFile ? (
        <div className={styles.editorWrap}>
          <MonacoEditor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme="vs-dark"
            onChange={handleChange}
            onMount={handleMount}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              lineNumbers: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'off',
              tabSize: 2,
              renderLineHighlight: 'line',
              glyphMargin: true,
              folding: true,
              smoothScrolling: true,
              cursorBlinking: 'phase',
              formatOnPaste: true,
            }}
          />
        </div>
      ) : (
        <div className={styles.welcome}>
          <div className={styles.welcomeIcon}>⌨</div>
          <div className={styles.welcomeTitle}>CODESTUDIO</div>
          <div className={styles.welcomeSub}>左のサイドバーからフォルダを開いてください</div>
        </div>
      )}
    </div>
  )
}
