import React, { useState } from 'react'
import functionBlocks from '../../data/functionBlocks.json'
import styles from './FunctionBlockPanel.module.css'

interface Block { id: string; label: string; category: string; code: string }

export const FunctionBlockPanel: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>FUNCTION BLOCK</div>
      <div className={styles.list}>
        {(functionBlocks as Block[]).map((b) => (
          <div key={b.id} className={styles.block}>
            <div className={styles.blockHeader}>
              <span className={styles.blockLabel}>{b.label}</span>
              <span className={styles.blockCat}>{b.category}</span>
              <button
                className={`${styles.copyBtn} ${copied === b.id ? styles.copyBtnDone : ''}`}
                onClick={() => copy(b.id, b.code)}
              >
                {copied === b.id ? '✓' : '⎘'}
              </button>
            </div>
            <pre className={styles.code}>{b.code}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
