import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { PlayIcon, PauseIcon, Languages, X } from 'lucide-react-native'
import { Slider } from '@react-native-assets/slider'
import { useAudioPlayerStore } from '@/app/stores/useAudioPlayerStore'
import { useReadingBottomBarStore } from '@/app/stores/useReadingBottomBarStore'
import * as Haptics from 'expo-haptics'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { usePathname } from 'expo-router'

const FloatingAudioPlayerContent = () => {
  const { currentTrack, clearTrack, playlist, currentTrackIndex, nextTrack } = useAudioPlayerStore()
  const { isVisible: bottomBarVisible, height: bottomBarHeight } = useReadingBottomBarStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const pathname = usePathname()

  const player = useAudioPlayer(currentTrack!.urls[currentIndex])
  const status = useAudioPlayerStatus(player)

  // Track if it's a manual language switch
  const [isManualSwitch, setIsManualSwitch] = useState(false)

  // Animated bottom padding
  const bottomPaddingValue = useSharedValue(24)

  // Animate bottom padding when bar visibility changes
  useEffect(() => {
    const targetPadding = bottomBarVisible ? bottomBarHeight + 24 : 24
    bottomPaddingValue.value = withTiming(targetPadding, { duration: 300 })
  }, [bottomBarVisible, bottomBarHeight])

  // Reset index and prepare for auto-play when track changes
  useEffect(() => {
    setCurrentIndex(0)
    setIsManualSwitch(false)
  }, [currentTrack])

  // Auto-play when new track loads
  useEffect(() => {
    if (status.isLoaded && status.currentTime === 0 && !status.playing) {
      player.play()
    }
  }, [status.isLoaded, currentTrack])

  // Close player when navigating away
  useEffect(() => {
    return () => {
      handleClose()
    }
  }, [pathname])

  // Auto-play next track when current one finishes
  useEffect(() => {
    if (status.isLoaded && !status.playing && status.currentTime >= status.duration - 0.1) {
      if (currentTrack && currentIndex < currentTrack.urls.length - 1) {
        // Move to next language in current track
        setCurrentIndex(prev => prev + 1)
      } else if (playlist.length > 0 && currentTrackIndex < playlist.length - 1) {
        // Move to next track in playlist
        setCurrentIndex(0)
        nextTrack()
      }
    }
  }, [status.isLoaded, status.playing, status.currentTime, status.duration, currentIndex, playlist, currentTrackIndex])

  // Play when moving to next track (auto or manual)
  useEffect(() => {
    if ((currentIndex > 0 || isManualSwitch) && status.isLoaded) {
      player.play()
      setIsManualSwitch(false)
    }
  }, [currentIndex, status.isLoaded])

  const handlePlayPause = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    if (status.playing) {
      player.pause()
    } else {
      // Restart from beginning if all tracks finished
      if (currentTrack && currentIndex === currentTrack.urls.length - 1 && status.currentTime >= status.duration - 0.1) {
        setCurrentIndex(0)
      }
      player.play()
    }
  }

  const handleLanguageToggle = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }

    // Stop current playback
    player.pause()
    player.seekTo(0)

    // Mark this as a manual switch so it auto-plays
    setIsManualSwitch(true)

    // Toggle to the other language
    const newIndex = currentIndex === 0 ? 1 : 0
    setCurrentIndex(newIndex)
  }

  const handleClose = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    player.pause()
    clearTrack()
  }

  const handleSeek = (value: number) => {
    // Convert milliseconds to seconds for expo-audio
    player.seekTo(value / 1000)
  }

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0
  const languageLabel = currentIndex === 0 ? 'Bahasa Arab' : 'Bahasa Melayu'
  const playlistInfo = playlist.length > 0 ? ` • ${currentTrackIndex + 1}/${playlist.length}` : ''

  // Animated style for smooth transition
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: bottomPaddingValue.value
  }))

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 px-4"
      style={animatedStyle}
      pointerEvents="box-none"
    >
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

        {/* Track Info & Slider */}
        <View className="flex-1 mr-3">
          <Text className="text-white font-semibold text-sm mb-1" numberOfLines={1}>
            {currentTrack?.title}{playlistInfo} • <Text className="text-gray-400 text-xs">{languageLabel}</Text>
          </Text>

          {/* Time display */}
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-400 text-xs">
              {formatTime(status.currentTime)}
            </Text>
            <Text className="text-gray-400 text-xs">
              {formatTime(status.duration)}
            </Text>
          </View>

          {/* Slider */}
          <Slider
            value={status.currentTime * 1000}
            onValueChange={handleSeek}
            maximumValue={status.duration * 1000 || 0}
            minimumValue={0}
            thumbSize={12}
            thumbTintColor="#FFF"
            minimumTrackTintColor="#22c55e"
            maximumTrackTintColor="#4b5563"
            trackHeight={3}
          />
        </View>

        {/* Language Toggle Button */}
        <View className="flex items-center gap-2">
          <TouchableOpacity
            onPress={handleClose}
            className="ml-2"
            activeOpacity={0.7}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLanguageToggle}
            className="ml-2 rounded-full px-3 py-2 flex-row items-center"
            activeOpacity={0.7}
          >
            <Languages size={16} color="#fff" />
            <Text className="text-white text-xs font-semibold ml-1">
              {currentIndex === 0 ? 'AR' : 'MS'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Animated.View>
  )
}

export default function FloatingAudioPlayer() {
  const { currentTrack, isVisible } = useAudioPlayerStore()

  if (!isVisible || !currentTrack) return null

  return <FloatingAudioPlayerContent />
}
