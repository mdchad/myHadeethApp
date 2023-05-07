import { CLERK_PUBLISHABLE_KEY } from "@env"
import { Slot, Stack, useSegments } from "expo-router";
import { Provider } from "@context/auth";
import { useFonts } from "expo-font";
import { ScheherazadeNew_400Regular, ScheherazadeNew_700Bold } from "@expo-google-fonts/scheherazade-new";
import { useCallback } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { tokenCache } from "../utils/cache";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

// const CLERK_PUBLISHABLE_KEY_FROM_ENV = CLERK_PUBLISHABLE_KEY;
const CLERK_PUBLISHABLE_KEY_FROM_ENV = 'pk_test_ZXhjaXRpbmctcmluZ3RhaWwtNjIuY2xlcmsuYWNjb3VudHMuZGV2JA';

export default function Root() {
    // const [fontsLoaded] = useFonts({
    //     Traditional_Arabic: require("@assets/fonts/Traditional-Arabic-Regular.ttf"),
    //     ScheherazadeNew_400Regular,
    //     ScheherazadeNew_700Bold
    // });

    // const onLayoutRootView = useCallback(async () => {
    //     if (fontsLoaded) {
    //         await SplashScreen.hideAsync();
    //     }
    // }, [fontsLoaded]);

    // if (!fontsLoaded) {
    //     return null;
    // }

    return (
        // Setup the auth context and render our layout inside of it.
        // <ClerkProvider publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        // <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY_FROM_ENV} tokenCache={tokenCache}>
            <Provider>
                <Slot />
            </Provider>
        // </ClerkProvider>
    );
}