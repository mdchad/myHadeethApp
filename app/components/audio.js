import React, { useState, useEffect } from 'react'
import { Button, View, Text, StyleSheet } from 'react-native'
import { Audio } from 'expo-av'
import { Slider } from '@react-native-assets/slider'

const SoundPlayer = () => {
  const [sound, setSound] = useState()
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [position, setPosition] = useState(0);

  useEffect(() => {
    loadAudio()
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, []);

  const loadAudio = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('./../../assets/audio/hadis-2-malay.mp3'),
      {
        shouldPlay: isPlaying,
      },
      onPlaybackStatusUpdate
    );
    setSound(sound);
  };

  const onPlaybackStatusUpdate = status => {
    setPlaybackStatus(status);
    if (status.isLoaded) {
      setPosition(status.positionMillis);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) {
      await loadAudio();
    } else {
      if (playbackStatus.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
    setIsPlaying(!playbackStatus.isPlaying);
  };

  const handleSeek = async value => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return (
    <View>
      <Button
        title={isPlaying ? 'Stop Sound' : 'Play Sound'}
        onPress={handlePlayPause}
      />
      <Slider
        value={position}
        onValueChange={handleSeek}
        maximumValue={playbackStatus.durationMillis || 0}
        minimumValue={0}
        disable={!playbackStatus.isLoaded}
      />
      <Text>{`Position: ${position}ms`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: 200,
    height: 40,
  },
});

export default SoundPlayer
