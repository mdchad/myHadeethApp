import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Hide the tab bar when navigating to this screen
        animation: 'slide_from_right'
      }}
    />
  )
}

export default _layout
