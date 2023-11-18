import React from 'react'
import { Stack, Tabs } from 'expo-router'
import Page from '../../../components/page'

const _layout = () => {
  return (
    <Page>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            // Hide the header for all other routes.
            headerShown: false
          }}
        />
        <Stack.Screen
          name="hadith"
          options={{
            // Hide the header for all other routes.
            headerShown: false
          }}
        />
      </Stack>
    </Page>
  )
}

export default _layout
