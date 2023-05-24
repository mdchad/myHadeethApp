import {Slot, Stack, Tabs, useSearchParams} from "expo-router";
import Page from '@components/page'
import { useAuth } from '@context/auth';

export const unstable_settings = {
    initialRouteName: "index"
}

export default function Layout() {
  const { title } = useSearchParams();

  return (
        <Page class="bg-[#EDEEC0]">
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
                        headerTitle: title ? title : '',
                        // Hide the header for all other routes.
                        headerShown: true,
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
                        headerShown: true,
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