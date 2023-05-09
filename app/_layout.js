// import { Slot, Stack } from "expo-router";
// import { Provider } from "@context/auth";
// import { useFonts } from "expo-font";
// import { ScheherazadeNew_400Regular, ScheherazadeNew_700Bold } from "@expo-google-fonts/scheherazade-new";
// import { useCallback } from "react";
// import { ClerkProvider } from "@clerk/clerk-expo";

// export default function Root() {
//     const [fontsLoaded] = useFonts({
//         Traditional_Arabic: require("@assets/fonts/Traditional-Arabic-Regular.ttf"),
//         ScheherazadeNew_400Regular,
//         ScheherazadeNew_700Bold
//     });

//     const onLayoutRootView = useCallback(async () => {
//         if (fontsLoaded) {
//             await SplashScreen.hideAsync();
//         }
//     }, [fontsLoaded]);

//     if (!fontsLoaded) {
//         return null;
//     }

//     return (
//         <ClerkProvider publishableKey="pk_test_ZXhjaXRpbmctcmluZ3RhaWwtNjIuY2xlcmsuYWNjb3VudHMuZGV2JA">
//             <Slot />
//         </ClerkProvider>
//     );
// }

import { Text, View } from "react-native";

import {
    Slot,
} from "expo-router";


import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function Layout() {
    // Render the children routes now that all the assets are loaded.
    return (<ClerkProvider publishableKey="pk_test_ZXhjaXRpbmctcmluZ3RhaWwtNjIuY2xlcmsuYWNjb3VudHMuZGV2JA">
        <SignedIn>
            <Text>You are Signed in</Text>
        </SignedIn>
        <SignedOut>
            <Text>You are not Signed in</Text>
        </SignedOut>
        <Slot />
    </ClerkProvider>);
}
