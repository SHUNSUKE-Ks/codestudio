import { create } from 'zustand'
import type { RightPanel, AppMode } from '../types'

interface LayoutState {
  // ── State ──────────────────────────────────────────────────
  isMobile: boolean
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  activeRightPanel: RightPanel
  sidebarWidth: number      // FileSidebar の幅 (px)  120〜400
  activeMode: AppMode       // HeaderBar のモード切り替え

  // ── Actions ────────────────────────────────────────────────
  setMobile: (v: boolean) => void
  toggleLeft: () => void
  setLeftOpen: (v: boolean) => void
  toggleRight: () => void
  setActivePanel: (panel: RightPanel) => void
  setSidebarWidth: (px: number) => void
  setActiveMode: (mode: AppMode) => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isMobile: false,
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  activeRightPanel: 'word',
  sidebarWidth: 200,
  activeMode: 'edit',

  setMobile: (v) => set({ isMobile: v }),
  toggleLeft: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  setLeftOpen: (v) => set({ leftSidebarOpen: v }),
  toggleRight: () => set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  setActivePanel: (panel) => set({ activeRightPanel: panel, rightSidebarOpen: true }),
  setSidebarWidth: (px) => set({ sidebarWidth: Math.min(400, Math.max(120, px)) }),
  setActiveMode: (mode) => set({ activeMode: mode }),
}))
