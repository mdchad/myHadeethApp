import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Stack initialRouteName='index'screenOptions={{ headerShown: false }} />
  )
}

export default _layout