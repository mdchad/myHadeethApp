import { Stack, useLocalSearchParams, useSegments } from 'expo-router'
import Page from '@components/page'
import { Platform } from 'react-native'

export default function Layout() {
  const { title } = useLocalSearchParams()

  return (
    <Page>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{
            // Hide the header for all other routes.
            headerShown: false,
            ...(Platform.OS === 'android' && { animation: 'none' })
          }}
        />
        <Stack.Screen
          name="volume"
          options={{
            headerTitle: title ? title : '',
            // Hide the header for all other routes.
            headerShown: false,
            headerTitleStyle: {
              fontSize: 24
            }
          }}
        />

        <Stack.Screen
          name="content"
          options={{
            // Hide the header for all other routes.
            headerTitle: '',
            headerShown: false
          }}
        />
      </Stack>
    </Page>
  )
}
