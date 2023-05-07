import { CLERK_PUBLISHABLE_KEY } from "@env"
import { Slot, Stack, useSegments } from "expo-router";
import { Provider } from "@context/auth";
// import { ClerkProvider, useUser } from "@clerk/clerk-expo";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "../utils/cache";
import Constants from "expo-constants";
import { Text } from "react-native";

const CLERK_PUBLISHABLE_KEY_FROM_ENV = CLERK_PUBLISHABLE_KEY;

export default function Root() {
    return (
        // Setup the auth context and render our layout inside of it.
        // <ClerkProvider publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY_FROM_ENV} tokenCache={tokenCache}>
            <SignedIn>
                <Text>You are Signed in</Text>
            </SignedIn>
            <SignedOut>
                <Text>You are Signed out</Text>
            </SignedOut>
            <Provider>
                <Slot />
            </Provider>
        </ClerkProvider>
    );
}