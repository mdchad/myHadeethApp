import React, { useState } from 'react'
import { Button } from 'react-native'
import { Audio } from 'expo-av'

const SoundPlayer = () => {
  const [sound, setSound] = useState()

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./../../assets/Hello.mp3'),
        // { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        {
          shouldPlay: true
        }
      )
      setSound(sound)
      await sound.playAsync()
    } catch (error) {
      console.log('Error playing sound: ', error)
    }
  }

  const stopSound = async () => {
    try {
      await sound.stopAsync()
      setSound(null)
    } catch (error) {
      console.log('Error stopping sound: ', error)
    }
  }

  const handleButtonPress = () => {
    if (sound) {
      stopSound()
    } else {
      playSound()
    }
  }

  Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true
  })

  return (
    <Button
      title={sound ? 'Stop Sound' : 'Play Sound'}
      onPress={handleButtonPress}
    />
  )
}

export default SoundPlayer
