import React, { useState } from 'react'
import manualRules from '../../data/manualRules.json'
import styles from './ManualPanel.module.css'

interface Rule { id: string; title: string; body: string }

export const ManualPanel: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className={styles.panel}>
      <div className={styles.header}>MANUAL</div>
      <div className={styles.list}>
        {(manualRules as Rule[]).map((r) => (
          <div key={r.id} className={styles.rule}>
            <button className={styles.ruleTitle} onClick={() => setOpen(open === r.id ? null : r.id)}>
              <span>{r.title}</span>
              <span className={styles.arrow}>{open === r.id ? '▲' : '▼'}</span>
            </button>
            {open === r.id && <pre className={styles.ruleBody}>{r.body}</pre>}
          </div>
        ))}
      </div>
    </div>
  )
}
