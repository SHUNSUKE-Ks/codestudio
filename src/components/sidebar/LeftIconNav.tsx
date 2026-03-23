import React from 'react'
import { useLayoutStore } from '../../stores/useLayoutStore'
import styles from './LeftIconNav.module.css'

const NAV_ITEMS = [
  { id: 'files',   icon: '◧', title: 'ファイル' },
  { id: 'search',  icon: '⌕', title: '検索' },
  { id: 'tree',    icon: '⑂', title: 'ツリー' },
  { id: 'debug',   icon: '⚑', title: 'デバッグ' },
]

export const LeftIconNav: React.FC = () => {
  const { toggleLeft } = useLayoutStore()

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item, i) => (
        <button
          key={item.id}
          className={`${styles.icon} ${i === 0 ? styles.iconActive : ''}`}
          title={item.title}
          onClick={i === 0 ? toggleLeft : undefined}
        >
          {item.icon}
        </button>
      ))}
      <div className={styles.spacer} />
      <button className={styles.icon} title="設定">⚙</button>
    </nav>
  )
}
