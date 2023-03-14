import { Slot, Stack, Tabs } from "expo-router";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="(tabs)"
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(modal)"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
          presentation: "containedModal",
        }}
      />
    </Stack>
  )
}