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
      <Stack.Screen
        name="introduction"
        options={{
          // Hide the header for all other routes.
          headerShown: false
        }}
      />
      <Stack.Screen
        name="hadith40"
        options={{
          // Hide the header for all other routes.
          headerShown: false
        }}
      />
      <Stack.Screen
        name="user"
        options={{
          // Hide the header for all other routes.
          headerShown: false
        }}
      />
    </Stack>
  )
}
