import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { PlayIcon, PauseIcon, Share2 } from 'lucide-react-native'
import { AudioWaveform } from './ui/audio-wavform'
import { useAudioPlayerStore } from '@/app/stores/useAudioPlayerStore'
import * as Haptics from 'expo-haptics'
import { shareHadith } from '@/app/utils/shareHadith'

const FloatingAudioPlayerContent = () => {
  const { currentTrack } = useAudioPlayerStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  const player = useAudioPlayer(currentTrack!.urls[currentIndex])
  const status = useAudioPlayerStatus(player)

  // Reset index when track changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [currentTrack])

  // Auto-play next track when current one finishes
  useEffect(() => {
    if (status.isLoaded && !status.playing && status.currentTime >= status.duration - 0.1) {
      if (currentIndex < currentTrack.urls.length - 1) {
        setCurrentIndex(prev => prev + 1)
      }
    }
  }, [status.isLoaded, status.playing, status.currentTime, status.duration, currentIndex])

  // Play when moving to next track
  useEffect(() => {
    if (currentIndex > 0 && status.isLoaded) {
      player.play()
    }
  }, [currentIndex])

  const handlePlayPause = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    if (status.playing) {
      player.pause()
    } else {
      // Restart from beginning if all tracks finished
      if (currentIndex === currentTrack.urls.length - 1 && status.currentTime >= status.duration - 0.1) {
        setCurrentIndex(0)
      }
      player.play()
    }
  }

  const handleShare = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    // You can implement share functionality here
    // shareHadith(...)
  }

  const progress = status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0
  const languageLabel = currentIndex === 0 ? 'Arabic' : 'Malay'

  return (
    <View className="absolute bottom-0 left-0 right-0 px-4 pb-6" pointerEvents="box-none">
      <View className="bg-gray-900/95 rounded-2xl px-4 py-3 flex-row items-center shadow-2xl">
        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={handlePlayPause}
          className="mr-3"
          activeOpacity={0.7}
        >
          <View className="bg-white rounded-full p-2">
            {status.playing ? (
              <PauseIcon size={20} color="#000" fill="#000" />
            ) : (
              <PlayIcon size={20} color="#000" fill="#000" />
            )}
          </View>
        </TouchableOpacity>

        {/* Track Info & Waveform */}
        <View className="flex-1 mr-3">
          <Text className="text-white font-semibold text-sm mb-1" numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text className="text-gray-400 text-xs mb-2" numberOfLines={1}>
            {languageLabel} {currentTrack.subtitle && `• ${currentTrack.subtitle}`}
          </Text>
          <AudioWaveform
            isPlaying={status.playing}
            progress={progress}
            height={40}
            barCount={40}
            barWidth={2}
            barGap={2}
            activeColor="#22c55e"
            inactiveColor="#4b5563"
            animated={true}
            showProgress={true}
            interactive={false}
          />
        </View>

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          className="ml-2"
          activeOpacity={0.7}
        >
          <Share2 size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function FloatingAudioPlayer() {
  const { currentTrack, isVisible } = useAudioPlayerStore()

  if (!isVisible || !currentTrack) return null

  return <FloatingAudioPlayerContent />
}
