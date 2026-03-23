import React from 'react'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { useMemoStore }   from '../../stores/useMemoStore'
import { PANEL_REGISTRY } from './PANEL_REGISTRY'
import type { RightPanel } from '../../types'
import styles from './RightSidebar.module.css'

// ── RightIconNav ⑪ ──────────────────────────────────────────────────────────
export const RightIconNav: React.FC = () => {
  const { activeRightPanel, setActivePanel, rightSidebarOpen, toggleRight } = useLayoutStore()
  const unresolvedCount = useMemoStore((s) => s.getUnresolvedCount())

  return (
    <nav className={styles.rnav}>
      {PANEL_REGISTRY.map((p) => {
        const isActive = rightSidebarOpen && activeRightPanel === p.id
        const hasBadge  = p.id === 'memo' && unresolvedCount > 0
        return (
          <button
            key={p.id}
            className={`${styles.rnavIcon} ${isActive ? styles.rnavActive : ''}`}
            title={p.label}
            onClick={() => {
              if (isActive) toggleRight()
              else setActivePanel(p.id as RightPanel)
            }}
          >
            {p.icon}
            {hasBadge && <span className={styles.rnavBadge}>{unresolvedCount}</span>}
          </button>
        )
      })}
    </nav>
  )
}

// ── RightSidebar ──────────────────────────────────────────────────────────────
export const RightSidebar: React.FC = () => {
  const { activeRightPanel, rightSidebarOpen } = useLayoutStore()
  if (!rightSidebarOpen) return null

  const active = PANEL_REGISTRY.find((p) => p.id === activeRightPanel)
  const PanelComponent = active?.component ?? null

  return (
    <div className={styles.sidebar}>
      {PanelComponent && <PanelComponent />}
    </div>
  )
}
