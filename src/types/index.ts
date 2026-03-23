// ─── Editor Types ───────────────────────────────────────────────────────────
export type Language = 'json' | 'javascript' | 'css' | 'markdown' | 'plaintext'

export interface FileEntry {
  path: string
  name: string
  content: string
  language: Language
  handle: FileSystemFileHandle
}

export interface TreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  handle: FileSystemFileHandle | FileSystemDirectoryHandle
  children: TreeNode[]
  depth: number
  expanded?: boolean
}

// ─── Memo Types ─────────────────────────────────────────────────────────────
export interface Memo {
  id: string
  filePath: string
  line: number
  content: string
  createdAt: number
  updatedAt: number
  resolved: boolean
}

export type MemoFilterMode = 'all' | 'unresolved'

// ─── Layout Types ────────────────────────────────────────────────────────────
export type RightPanel = 'word' | 'func' | 'manual' | 'memo'
export type AppMode = 'edit' | 'preview' | 'schema'

export interface PanelRegistryItem {
  id: RightPanel
  label: string
  icon: string
  component: React.ComponentType
}

// ─── Project Types ───────────────────────────────────────────────────────────
export interface FolderTemplate {
  id: string
  name: string
  description: string
  folders: string[]
  files: { path: string; content: string }[]
}
