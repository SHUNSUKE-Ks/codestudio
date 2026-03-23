import { create } from 'zustand'
import { openDB } from 'idb'
import { nanoid } from 'nanoid'
import type { Memo, MemoFilterMode } from '../types'

const DB_NAME = 'codestudio-memos'
const STORE_NAME = 'memos'

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    },
  })
}

interface MemoState {
  memos: Memo[]
  activeMemo: Memo | null
  selectedLine: number | null
  filterMode: MemoFilterMode
  // Monaco editor ref for jump
  editorRef: any | null

  loadMemos: () => Promise<void>
  addMemo: (filePath: string, line: number, content: string) => Promise<void>
  editMemo: (id: string, content: string) => Promise<void>
  deleteMemo: (id: string) => Promise<void>
  toggleResolved: (id: string) => Promise<void>
  setSelectedLine: (line: number | null) => void
  setActiveMemo: (memo: Memo | null) => void
  setFilterMode: (mode: MemoFilterMode) => void
  setEditorRef: (ref: any) => void
  jumpToMemo: (memo: Memo) => void
  getMemosForFile: (filePath: string) => Memo[]
  getUnresolvedCount: () => number
}

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: [],
  activeMemo: null,
  selectedLine: null,
  filterMode: 'all',
  editorRef: null,

  loadMemos: async () => {
    const db = await getDB()
    const all = await db.getAll(STORE_NAME)
    set({ memos: all })
  },

  addMemo: async (filePath, line, content) => {
    const memo: Memo = {
      id: nanoid(),
      filePath, line, content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      resolved: false,
    }
    const db = await getDB()
    await db.add(STORE_NAME, memo)
    set((s) => ({ memos: [...s.memos, memo], activeMemo: memo }))
  },

  editMemo: async (id, content) => {
    const db = await getDB()
    const { memos } = get()
    const updated = memos.map((m) =>
      m.id === id ? { ...m, content, updatedAt: Date.now() } : m
    )
    const target = updated.find((m) => m.id === id)!
    await db.put(STORE_NAME, target)
    set({ memos: updated })
  },

  deleteMemo: async (id) => {
    const db = await getDB()
    await db.delete(STORE_NAME, id)
    set((s) => ({
      memos: s.memos.filter((m) => m.id !== id),
      activeMemo: s.activeMemo?.id === id ? null : s.activeMemo,
    }))
  },

  toggleResolved: async (id) => {
    const { memos } = get()
    const updated = memos.map((m) =>
      m.id === id ? { ...m, resolved: !m.resolved, updatedAt: Date.now() } : m
    )
    const target = updated.find((m) => m.id === id)!
    const db = await getDB()
    await db.put(STORE_NAME, target)
    set({ memos: updated })
  },

  setSelectedLine: (line) => set({ selectedLine: line }),
  setActiveMemo: (memo) => set({ activeMemo: memo }),
  setFilterMode: (mode) => set({ filterMode: mode }),
  setEditorRef: (ref) => set({ editorRef: ref }),

  jumpToMemo: (memo) => {
    const { editorRef } = get()
    if (!editorRef) return
    editorRef.revealLineInCenter(memo.line)
    editorRef.setPosition({ lineNumber: memo.line, column: 1 })
    editorRef.focus()
  },

  getMemosForFile: (filePath) => {
    const { memos, filterMode } = get()
    return memos
      .filter((m) => m.filePath === filePath && (filterMode === 'all' || !m.resolved))
      .sort((a, b) => a.line - b.line)
  },

  getUnresolvedCount: () => get().memos.filter((m) => !m.resolved).length,
}))
