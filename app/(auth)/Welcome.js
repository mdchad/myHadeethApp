import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, Image, SafeAreaView, Text, View, ImageBackground, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import * as Location from 'expo-location';

const width = Dimensions.get("window").width;

export default function Welcome() {
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'loading...'
  );

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const [fontsLoaded] = useFonts({
    Langar: require("@assets/fonts/Langar-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const image = require("@assets/welcome-bg.png");

  return (
    <SafeAreaView style={styles.container} >
      <ImageBackground source={image} style={styles.image} resizeMode="contain"
        // align image to bottom
        imageStyle={{ bottom: 0, position: "absolute" }}
      >
        <View className="flex gap-7 items-center justify-center h-full">
          <Image
            source={require("@assets/hadeeth-logo.png")}
            style={{ width: width, height: 170, aspectRatio: 1, resizeMode: "contain" }}
          />
          <View>
            <Text
              className="mt-5 text-[32px] text-center"
              style={{ fontFamily: "Langar" }}
            >
              Ahlan Wa Sahlan !
            </Text>
            <Text
              className="mt-5 text-[32px] text-center"
              style={{ fontFamily: "Langar" }}
            >
              Welcome !
            </Text>
          </View>

          <Text className="mt-5 text-[18px] text-center w-[200px]">
            Learn more about our collection of Hadeeth
          </Text>

          <Text style={styles.paragraph}>{text}</Text>

          <Link style={styles.button} href="/(auth)/SignIn" className="shadow-2xl overflow-hidden rounded-3xl flex items-center justify-center py-3 px-5 w-[160px] bg-[#1EAB53] border-transparent">
            <Text className="text-sm font-bold text-center text-white uppercase">
              Get Started
            </Text>
          </Link>
        </View>
      </ImageBackground>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EDEEC0",
    margin: 0,
    padding: 0,
    flex: 1,
  },
  image: {
    height: "100%",
  },
  button: {
    borderRadius: 10,
  },
});
