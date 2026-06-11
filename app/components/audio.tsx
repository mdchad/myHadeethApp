import React, { useState, useEffect } from 'react'
import {View, TouchableOpacity, ActivityIndicator} from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { Slider } from '@react-native-assets/slider'
import {Loader, PauseIcon, PlayIcon, StopCircle} from "lucide-react-native";

interface SoundPlayerProps {
  // Some hadith40 content entries have no recorded audio; expo-audio accepts
  // a null source, so undefined is normalized below.
  url?: string;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({url}) => {
  const player = useAudioPlayer(url ?? null)
  const status = useAudioPlayerStatus(player)

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause()
    } else {
      // If playback ended, seek to beginning before playing
      if (status.currentTime >= status.duration) {
        player.seekTo(0)
      }
      player.play()
    }
  }

  const handleSeek = (value: number) => {
    // Convert milliseconds to seconds for expo-audio
    player.seekTo(value / 1000)
  }

  return (
    <View className="rounded-md mt-4 flex flex-row bg-gray-800/90 w-full flex-shrink space-x-4 items-center py-1 px-2">
      <View className="mr-4">
        {
          status.playing ? (
            <TouchableOpacity onPress={handlePlayPause}>
              <PauseIcon size={20} color="white" fill="#fff"/>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePlayPause}>
              <PlayIcon size={20} color="white" fill="#fff"/>
            </TouchableOpacity>
          )
        }
      </View>
      <View className="flex-1">
        <Slider
          value={status.currentTime * 1000}
          trackStyle={{
            backgroundColor: 'rgb(156, 163, 175)'
          }}
          onValueChange={handleSeek}
          maximumValue={status.duration * 1000 || 0}
          minimumValue={0}
          thumbSize={14}
          enabled={!!status.duration}
          thumbTintColor="white"
          trackHeight={3}
        />
      </View>
    </View>
  )
}

export default SoundPlayer
