import {Slot} from "expo-router";
import { Provider } from "@context/auth";
import { useFonts } from "expo-font";
import { ScheherazadeNew_400Regular, ScheherazadeNew_700Bold } from "@expo-google-fonts/scheherazade-new";
import { tokenCache } from "../utils/cache";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import {TRPCProvider} from "../utils/trpc";
import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const CLERK_PUBLISHABLE_KEY_FROM_ENV = CLERK_PUBLISHABLE_KEY;
const CLERK_PUBLISHABLE_KEY_FROM_ENV = 'pk_test_YWNjZXB0ZWQtbGVtdXItODcuY2xlcmsuYWNjb3VudHMuZGV2JA';

export default function Root() {
    const [fontsLoaded] = useFonts({
        Traditional_Arabic: require("@assets/fonts/Traditional-Arabic-Regular.ttf"),
        Traditional_ArabicRegular: require("@assets/fonts/trado.ttf"),
        Traditional_ArabicBold: require("@assets/fonts/tradbdo.ttf"),
        KFGQPC_Regular: require("@assets/fonts/kfgqpc-arabic-symbols.ttf"),
        ScheherazadeNew_400Regular,
        ScheherazadeNew_700Bold
    });

    useEffect(() => {
        // await AsyncStorage.clear();
        AsyncStorage.getAllKeys()
          .then(keys => AsyncStorage.multiRemove(keys))
          .then(() => console.log('success'));
    }, [])

    // const onLayoutRootView = useCallback(async () => {
    //     if (fontsLoaded) {
    //         await SplashScreen.hideAsync();
    //     }
    // }, [fontsLoaded]);
    //
    // if (!fontsLoaded) {
    //     return null;
    // }

    return (
        // Set up the auth context and render our layout inside it.
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY_FROM_ENV} tokenCache={tokenCache}>
            <TRPCProvider>
                <Provider>
                    <Slot/>
                </Provider>
            </TRPCProvider>
        </ClerkProvider>
    );
}