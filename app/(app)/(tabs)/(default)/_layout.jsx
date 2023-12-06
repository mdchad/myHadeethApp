import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false}}/>
      <Stack.Screen name="hadith" options={{ headerShown: false}}/>
    </Stack>
  )
}

export default _layout
