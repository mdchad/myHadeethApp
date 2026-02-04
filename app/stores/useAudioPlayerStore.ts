import { create } from 'zustand'

interface AudioTrack {
  urls: string[]  // [arabicUrl, malayUrl]
  title: string
  subtitle?: string
}

interface AudioPlayerStore {
  currentTrack: AudioTrack | null
  isVisible: boolean
  playTrack: (track: AudioTrack) => void
  clearTrack: () => void
}

export const useAudioPlayerStore = create<AudioPlayerStore>((set) => ({
  currentTrack: null,
  isVisible: false,
  playTrack: (track) => set({ currentTrack: track, isVisible: true }),
  clearTrack: () => set({ currentTrack: null, isVisible: false }),
}))
