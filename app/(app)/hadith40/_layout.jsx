import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        // Hide the header for all other routes.
        headerShown: false
      }}
    />
  )
}

export default _layout
