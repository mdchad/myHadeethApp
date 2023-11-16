import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)/">
      <Stack.Screen
        name="(tabs)"
        options={{
          // Hide the header for all other routes.
          headerShown: false
        }}
      />
    </Stack>
  )
}
