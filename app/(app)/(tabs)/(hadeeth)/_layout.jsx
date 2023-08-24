import {Slot, Stack, Tabs, useRouter, useSearchParams, useSegments} from "expo-router";
import Page from '@components/page'
import { useAuth } from '@context/auth';

export const unstable_settings = {
    initialRouteName: "index"
}

export default function Layout() {
  const { title } = useSearchParams();
  const segment = useSegments();

  const notMainPage = segment.includes('content') || segment.includes('volume')
  const topBar = notMainPage ? 'bg-white' : 'bg-[#EDEEC0]'
  const router = useRouter()

  return (
        <Page class={topBar}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="index"
                    options={{
                        // Hide the header for all other routes.
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="volume"
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