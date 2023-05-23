import { Slot, Stack, Tabs } from "expo-router";
import Page from '@components/page'
import Header from '@components/header';
import { useAuth } from '@context/auth';

export const unstable_settings = {
    initialRouteName: "index"
}

export default function Layout() {
    const { user } = useAuth();

    return (
        <Page class="bg-[#EDEEC0]">
            <Header user={user} />
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