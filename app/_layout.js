import { Slot, Stack } from "expo-router";
import { Provider } from "@context/auth";
import {useFonts} from "expo-font";
import {ScheherazadeNew_400Regular, ScheherazadeNew_700Bold} from "@expo-google-fonts/scheherazade-new";
import {useCallback} from "react";
import * as SplashScreen from 'expo-splash-screen';
import {View} from "react-native";

export default function Root() {
  const [fontsLoaded] = useFonts({
    Traditional_Arabic: require("@assets/fonts/Traditional-Arabic-Regular.ttf"),
    ScheherazadeNew_400Regular,
    ScheherazadeNew_700Bold
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    // Setup the auth context and render our layout inside of it.
    <Provider>
      <Slot />
    </Provider>
  );
}