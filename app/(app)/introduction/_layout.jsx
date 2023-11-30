import React from 'react'
import { Stack } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index'
}

const _layout = () => {
  return (
    <Stack
      initialRouteName="index"
      options={{
        // Hide the header for all other routes.
        headerShown: false
      }}
    />
  )
}

export default _layout
