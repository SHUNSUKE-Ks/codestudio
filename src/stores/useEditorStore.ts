import { create } from 'zustand'
import type { FileEntry } from '../types'

interface CursorPos { line: number; column: number }

interface EditorState {
  // ── State ──────────────────────────────────────────────────
  openFiles: FileEntry[]
  activeFile: FileEntry | null
  cursorPosition: CursorPos
  isDirty: boolean
  searchQuery: string
  searchIndex: number    // 現在のヒット番号

  // ── Actions ────────────────────────────────────────────────
  openFile: (entry: FileEntry) => void
  closeFile: (path: string) => void
  setActive: (path: string) => void
  updateContent: (path: string, content: string) => void
  setCursor: (line: number, column: number) => void
  setDirty: (v: boolean) => void
  setSearchQuery: (q: string) => void
  nextMatch: () => void
  prevMatch: () => void
  setSearchIndex: (n: number) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  activeFile: null,
  cursorPosition: { line: 1, column: 1 },
  isDirty: false,
  searchQuery: '',
  searchIndex: 0,

  openFile: (entry) => {
    const { openFiles } = get()
    const exists = openFiles.find((f) => f.path === entry.path)
    if (!exists) set({ openFiles: [...openFiles, entry] })
    set({ activeFile: entry, isDirty: false })
  },

  closeFile: (path) => {
    const { openFiles, activeFile } = get()
    const next = openFiles.filter((f) => f.path !== path)
    const nextActive = activeFile?.path === path
      ? next[next.length - 1] ?? null
      : activeFile
    set({ openFiles: next, activeFile: nextActive })
  },

  setActive: (path) => {
    const file = get().openFiles.find((f) => f.path === path) ?? null
    set({ activeFile: file, isDirty: false })
  },

  updateContent: (path, content) => {
    const { openFiles, activeFile } = get()
    const next = openFiles.map((f) => f.path === path ? { ...f, content } : f)
    set({
      openFiles: next,
      activeFile: activeFile?.path === path ? { ...activeFile, content } : activeFile,
      isDirty: true,
    })
  },

  setCursor: (line, column) => set({ cursorPosition: { line, column } }),
  setDirty: (v) => set({ isDirty: v }),
  setSearchQuery: (q) => set({ searchQuery: q, searchIndex: 0 }),
  nextMatch: () => set((s) => ({ searchIndex: s.searchIndex + 1 })),
  prevMatch: () => set((s) => ({ searchIndex: Math.max(0, s.searchIndex - 1) })),
  setSearchIndex: (n) => set({ searchIndex: n }),
}))
