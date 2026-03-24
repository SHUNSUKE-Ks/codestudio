import { create } from 'zustand'

export interface ShortcutRoom {
  id: string
  name: string
  items: Record<string, string> // key -> word mapping
}

interface ShortcutFooterState {
  isOpen: boolean
  toggle: () => void
  setIsOpen: (isOpen: boolean) => void

  rooms: ShortcutRoom[]
  activeRoomId: string
  
  addRoom: (name: string) => void
  setActiveRoom: (id: string) => void
  updateShortcut: (roomId: string, key: string, word: string) => void
  
  exportJSON: () => string
  importJSON: (jsonString: string) => void
}

const defaultRooms: ShortcutRoom[] = [
  { id: '1', name: 'Main', items: {} },
  { id: '2', name: 'Work', items: { q: 'Work Address', w: 'Email Template' } },
  { id: '3', name: 'Personal', items: { a: 'Account Details', s: 'Social Handle' } },
]

export const useShortcutFooterStore = create<ShortcutFooterState>((set, get) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),

  rooms: defaultRooms,
  activeRoomId: '1',

  addRoom: (name: string) => set((state) => {
    const newRoom: ShortcutRoom = {
      id: Date.now().toString(),
      name,
      items: {}
    }
    return {
      rooms: [...state.rooms, newRoom],
      activeRoomId: newRoom.id
    }
  }),

  setActiveRoom: (id: string) => set({ activeRoomId: id }),

  updateShortcut: (roomId: string, key: string, word: string) => set((state) => {
    const updatedRooms = state.rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          items: {
            ...room.items,
            [key]: word
          }
        }
      }
      return room
    })
    return { rooms: updatedRooms }
  }),

  exportJSON: () => {
    const state = get()
    return JSON.stringify({ rooms: state.rooms }, null, 2)
  },

  importJSON: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.rooms && Array.isArray(data.rooms)) {
        set({ rooms: data.rooms, activeRoomId: data.rooms[0]?.id || '' })
      }
    } catch (e) {
      console.error('Failed to import JSON', e)
    }
  }
}))
