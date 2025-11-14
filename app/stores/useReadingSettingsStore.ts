import { create } from 'zustand'
import storage from '@/app/shared/storage'

interface ReadingSettingsState {
  fontSizeIndex: number
  setFontSizeIndex: (size: number) => void
}

export const useReadingSettingsStore = create<ReadingSettingsState>((set) => ({
  // Initialize from storage, default to 3
  fontSizeIndex: storage.getNumber('hadith-font-size') ?? 3,

  setFontSizeIndex: (size: number) => {
    // Update both store and storage
    set({ fontSizeIndex: size })
    storage.set('hadith-font-size', size)
  },
}))
