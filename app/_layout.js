import {Slot} from "expo-router";
import { Provider } from "@context/auth";
import { useFonts } from "expo-font";
import { ScheherazadeNew_400Regular, ScheherazadeNew_700Bold } from "@expo-google-fonts/scheherazade-new";
import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        <Provider>
            <Slot/>
        </Provider>
    );
}