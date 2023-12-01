import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
  )
}

export default _layout
