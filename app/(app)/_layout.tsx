import { Stack } from 'expo-router'

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: '(tabs)/',
};

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
      <Stack.Screen
        name="hadith-detail"
        options={{
          // Hide the header for all other routes.
          headerShown: false
        }}
      />
      <Stack.Screen
        name="hadiths"
        options={{
          // Hide the header for all other routes.
          headerShown: false
        }}
      />
    </Stack>
  )
}
