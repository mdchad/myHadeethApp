import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}

export default _layout
