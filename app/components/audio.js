import React, { useState, useEffect } from 'react'
import {View, TouchableOpacity, ActivityIndicator} from 'react-native'
import { Audio } from 'expo-av'
import { Slider } from '@react-native-assets/slider'
import {Loader, PauseIcon, PlayIcon, StopCircle} from "lucide-react-native";

const SoundPlayer = ({url}) => {
  const [sound, setSound] = useState()
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // loadAudio().then(() => {
    // }).catch(e => {
    //   console.log('eerrrr', e)
    // })
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const loadAudio = async () => {
    const uri = `https://my-way-web.vercel.app/audio/${url}.mp3`
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        // require('../../assets/audio/hadis-2-malay.mp3'),
        { uri },
        null,
        onPlaybackStatusUpdate
      );
      setSound(sound);
      await sound.playAsync()
    } catch (e) {
      console.log('errr', e)
    }

  };

  const onPlaybackStatusUpdate = status => {
    console.log(status)
    setPlaybackStatus(status);
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying)
    }
  };

  const handlePlayPause = async () => {
    if (!sound) {
      await loadAudio();
    } else {
      if (playbackStatus.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.replayAsync();
      }
    }
    setIsPlaying(!playbackStatus.isPlaying);
  };

  const handleSeek = async value => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  // if (!sound) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="small" color="#0000ff" />
  //     </View>
  //   )
  // }

  return (
    <View className="rounded-md mt-4 flex flex-row bg-gray-800/90 w-full flex-shrink space-x-4 items-center py-1 px-2">
      <View>
        {
          isPlaying ? (
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
          value={position}
          style={{
            width: 240
          }}
          trackStyle={{
            width: 40,
            backgroundColor: 'rgb(156, 163, 175)'
          }}
          onValueChange={handleSeek}
          maximumValue={playbackStatus.durationMillis || 0}
          minimumValue={0}
          thumbSize={14}
          disable={!playbackStatus.isLoaded}
          thumbTintColor="white"
          trackHeight={3}
        />
      </View>
    </View>
  )
}

export default SoundPlayer
