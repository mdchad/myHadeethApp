import { create } from 'zustand'

interface ReadingBottomBarStore {
  isVisible: boolean
  height: number
  setVisible: (visible: boolean) => void
  setHeight: (height: number) => void
}

export const useReadingBottomBarStore = create<ReadingBottomBarStore>((set) => ({
  isVisible: true,
  height: 100,
  setVisible: (visible) => set({ isVisible: visible }),
  setHeight: (height) => set({ height }),
}))
