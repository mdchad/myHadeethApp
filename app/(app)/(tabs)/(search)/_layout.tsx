import React from 'react'
import { Stack, Tabs } from 'expo-router'
import Page from '@/app/components/page'

const _layout = () => {
  return (
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            // Hide the header for all other routes.
            headerShown: false
          }}
        />
      </Stack>
  )
}

export default _layout
