import React, { useEffect } from 'react'
import { HeaderBar }       from '../header/HeaderBar'
import { LeftIconNav }     from '../sidebar/LeftIconNav'
import { FileSidebar }     from '../sidebar/FileSidebar'
import { EditorArea }      from '../editor/EditorArea'
import { RightSidebar, RightIconNav } from '../right/RightSidebar'
import { FooterStatusBar } from './FooterStatusBar'
import { ShortcutFooter }  from './ShortcutFooter'
import { useLayoutStore }  from '../../stores/useLayoutStore'
import { useMemoStore }    from '../../stores/useMemoStore'
import { useShortcut }     from '../../hooks/useShortcut'
import styles from './AppLayout.module.css'

export const AppLayout: React.FC = () => {
  const { isMobile, setMobile, leftSidebarOpen } = useLayoutStore()
  const { loadMemos } = useMemoStore()
  useShortcut()

  // モバイル判定 ⑦
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [setMobile])

  // IndexedDB からメモを初期ロード
  useEffect(() => { loadMemos() }, [loadMemos])

  if (isMobile) return <MobileLayout />

  return (
    <div className={styles.app}>
      <HeaderBar />
      <div className={styles.body}>
        <LeftIconNav />
        {leftSidebarOpen && <FileSidebar />}
        <EditorArea />
        <RightSidebar />
        <RightIconNav />
      </div>
      <FooterStatusBar />
      <ShortcutFooter />
    </div>
  )
}

// ── Mobile layout ────────────────────────────────────────────────────────────
const MobileLayout: React.FC = () => {
  const { activeRightPanel, setActivePanel, leftSidebarOpen, setLeftOpen } = useLayoutStore()
  const { loadMemos } = useMemoStore()
  useShortcut()
  useEffect(() => { loadMemos() }, [loadMemos])

  return (
    <div className={styles.mobileApp}>
      <HeaderBar />
      <div className={styles.mobileBody}>
        {leftSidebarOpen
          ? <FileSidebar />
          : activeRightPanel !== 'word' && activeRightPanel !== 'func' && activeRightPanel !== 'manual' && activeRightPanel !== 'memo'
            ? <EditorArea />
            : <RightSidebar />
        }
        {!leftSidebarOpen && <EditorArea />}
      </div>
      {/* BottomNav */}
      <nav className={styles.bottomNav}>
        {[
          { icon: '📁', label: 'Files',  action: () => setLeftOpen(!leftSidebarOpen) },
          { icon: '✏',  label: 'Edit',   action: () => setLeftOpen(false) },
          { icon: 'W',  label: 'Words',  action: () => { setLeftOpen(false); setActivePanel('word') } },
          { icon: 'M',  label: 'Memo',   action: () => { setLeftOpen(false); setActivePanel('memo') } },
        ].map((item) => (
          <button key={item.label} className={styles.bottomNavBtn} onClick={item.action}>
            <span className={styles.bottomNavIcon}>{item.icon}</span>
            <span className={styles.bottomNavLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
      <ShortcutFooter />
    </div>
  )
}
