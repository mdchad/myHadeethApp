import { create } from 'zustand'

interface AudioTrack {
  urls: string[]  // [arabicUrl, malayUrl]
  title: string
  subtitle?: string
}

interface AudioPlayerStore {
  currentTrack: AudioTrack | null
  isVisible: boolean
  playlist: AudioTrack[]
  currentTrackIndex: number
  playTrack: (track: AudioTrack) => void
  playPlaylist: (tracks: AudioTrack[]) => void
  nextTrack: () => void
  clearTrack: () => void
}

export const useAudioPlayerStore = create<AudioPlayerStore>((set, get) => ({
  currentTrack: null,
  isVisible: false,
  playlist: [],
  currentTrackIndex: 0,
  playTrack: (track) => set({ currentTrack: track, isVisible: true, playlist: [], currentTrackIndex: 0 }),
  playPlaylist: (tracks) => {
    if (tracks.length > 0) {
      set({
        playlist: tracks,
        currentTrack: tracks[0],
        currentTrackIndex: 0,
        isVisible: true
      })
    }
  },
  nextTrack: () => {
    const { playlist, currentTrackIndex } = get()
    const nextIndex = currentTrackIndex + 1
    if (nextIndex < playlist.length) {
      set({
        currentTrackIndex: nextIndex,
        currentTrack: playlist[nextIndex]
      })
    } else {
      // Playlist finished, clear everything
      set({
        currentTrack: null,
        isVisible: false,
        playlist: [],
        currentTrackIndex: 0
      })
    }
  },
  clearTrack: () => set({ currentTrack: null, isVisible: false, playlist: [], currentTrackIndex: 0 }),
}))
