import { create } from 'zustand'
import type { TreeNode, FolderTemplate, Language } from '../types'
import { useEditorStore } from './useEditorStore'

function extToLang(name: string): Language {
  if (name.endsWith('.json')) return 'json'
  if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.jsx')) return 'javascript'
  if (name.endsWith('.css')) return 'css'
  if (name.endsWith('.md')) return 'markdown'
  return 'plaintext'
}

async function buildTree(
  dirHandle: FileSystemDirectoryHandle,
  path = '',
  depth = 0
): Promise<TreeNode[]> {
  const nodes: TreeNode[] = []
  for await (const [name, handle] of (dirHandle as any).entries()) {
    if (name.startsWith('.')) continue
    const nodePath = path ? `${path}/${name}` : name
    if (handle.kind === 'directory') {
      nodes.push({
        name, path: nodePath, type: 'folder', handle,
        depth, expanded: depth === 0,
        children: await buildTree(handle as FileSystemDirectoryHandle, nodePath, depth + 1),
      })
    } else {
      nodes.push({ name, path: nodePath, type: 'file', handle, depth, children: [] })
    }
  }
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

interface ProjectState {
  rootHandle: FileSystemDirectoryHandle | null
  fileTree: TreeNode[]
  isLoaded: boolean

  selectRoot: () => Promise<void>
  refreshTree: () => Promise<void>
  openFileEntry: (node: TreeNode) => Promise<void>
  createFile: (name: string, parentPath?: string) => Promise<void>
  createFolder: (name: string, parentPath?: string) => Promise<void>
  saveActiveFile: () => Promise<void>
  applyTemplate: (tpl: FolderTemplate) => Promise<void>
  toggleFolder: (path: string) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  rootHandle: null,
  fileTree: [],
  isLoaded: false,

  selectRoot: async () => {
    try {
      const handle = await (window as any).showDirectoryPicker()
      const tree = await buildTree(handle)
      set({ rootHandle: handle, fileTree: tree, isLoaded: true })
    } catch (_) { /* user cancelled */ }
  },

  refreshTree: async () => {
    const { rootHandle } = get()
    if (!rootHandle) return
    const tree = await buildTree(rootHandle)
    set({ fileTree: tree })
  },

  openFileEntry: async (node) => {
    if (node.type !== 'file') return
    const fileHandle = node.handle as FileSystemFileHandle
    const file = await fileHandle.getFile()
    const content = await file.text()
    useEditorStore.getState().openFile({
      path: node.path,
      name: node.name,
      content,
      language: extToLang(node.name),
      handle: fileHandle,
    })
  },

  createFile: async (name, parentPath) => {
    const { rootHandle, refreshTree } = get()
    if (!rootHandle) return
    let dir: FileSystemDirectoryHandle = rootHandle
    if (parentPath) {
      for (const segment of parentPath.split('/')) {
        dir = await dir.getDirectoryHandle(segment)
      }
    }
    await dir.getFileHandle(name, { create: true })
    await refreshTree()
  },

  createFolder: async (name, parentPath) => {
    const { rootHandle, refreshTree } = get()
    if (!rootHandle) return
    let dir: FileSystemDirectoryHandle = rootHandle
    if (parentPath) {
      for (const segment of parentPath.split('/')) {
        dir = await dir.getDirectoryHandle(segment)
      }
    }
    await dir.getDirectoryHandle(name, { create: true })
    await refreshTree()
  },

  saveActiveFile: async () => {
    const { activeFile, setDirty } = useEditorStore.getState()
    if (!activeFile) return
    const writable = await activeFile.handle.createWritable()
    await writable.write(activeFile.content)
    await writable.close()
    setDirty(false)
  },

  applyTemplate: async (tpl) => {
    const { rootHandle, refreshTree } = get()
    if (!rootHandle) return
    for (const folder of tpl.folders) {
      let dir: FileSystemDirectoryHandle = rootHandle
      for (const seg of folder.split('/')) {
        dir = await dir.getDirectoryHandle(seg, { create: true })
      }
    }
    for (const { path, content } of tpl.files) {
      const parts = path.split('/')
      const fileName = parts.pop()!
      let dir: FileSystemDirectoryHandle = rootHandle
      for (const seg of parts) {
        dir = await dir.getDirectoryHandle(seg, { create: true })
      }
      const fh = await dir.getFileHandle(fileName, { create: true })
      const w = await fh.createWritable()
      await w.write(content)
      await w.close()
    }
    await refreshTree()
  },

  toggleFolder: (path) => {
    const toggle = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((n) =>
        n.path === path
          ? { ...n, expanded: !n.expanded }
          : { ...n, children: toggle(n.children) }
      )
    set((s) => ({ fileTree: toggle(s.fileTree) }))
  },
}))
