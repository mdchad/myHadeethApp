import { Slot, Stack, Tabs } from "expo-router";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import Page from '@components/page'
import { useAuth } from "@context/auth";
import Header from '@components/header';

export default function Layout() {
  const { user } = useAuth()

  return (
    <Page>
      <Header user={user?.full_name} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            // Hide the header for all other routes.
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="category"
          options={{
            // Hide the header for all other routes.
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="content"
          options={{
            // Hide the header for all other routes.
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="chapter"
          options={{
            // Hide the header for all other routes.
            headerShown: false,
          }}
        />

      </Stack>
    </Page>
  )
}