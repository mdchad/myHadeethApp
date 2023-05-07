import { Slot, Stack, Tabs } from "expo-router";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import Page from '@components/page'
// import { useAuth } from "@context/auth";
import { useUser } from "@clerk/clerk-expo";
import Header from '@components/header';

export default function Layout() {
    //   const { user } = useAuth()
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
        return null;
    }

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