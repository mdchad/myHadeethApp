import React, { useState, useEffect } from 'react'
import {View, TouchableOpacity, ActivityIndicator} from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { Slider } from '@react-native-assets/slider'
import {Loader, PauseIcon, PlayIcon, StopCircle} from "lucide-react-native";

interface SoundPlayerProps {
  url: string;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({url}) => {
  const player = useAudioPlayer(url)
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

  const handleSeek = (value) => {
    // Convert milliseconds to seconds for expo-audio
    player.seekTo(value / 1000)
  }

  return (
    <View className="rounded-md mt-4 flex flex-row bg-gray-800/90 w-full flex-shrink space-x-4 items-center py-1 px-2">
      <View>
        {
          status.playing ? (
            <TouchableOpacity onPress={handlePlayPause}>
              <PauseIcon size={24} color="white" fill="#fff"/>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePlayPause}>
              <PlayIcon size={24} color="white" fill="#fff"/>
            </TouchableOpacity>
          )
        }
      </View>
      <View className="w-full">
        <Slider
          value={status.currentTime * 1000}
          style={{
            width: 240
          }}
          trackStyle={{
            width: 40,
            backgroundColor: 'rgb(156, 163, 175)'
          }}
          onValueChange={handleSeek}
          maximumValue={status.duration * 1000 || 0}
          minimumValue={0}
          thumbSize={14}
          disable={!status.duration}
          thumbTintColor="white"
          trackHeight={3}
        />
      </View>
    </View>
  )
}

export default SoundPlayer
