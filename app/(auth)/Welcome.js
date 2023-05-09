import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, Image, SafeAreaView, Text, View, ImageBackground, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import * as Location from 'expo-location';
import { useAuth } from "@context/auth";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {ScheherazadeNew_400Regular, ScheherazadeNew_700Bold} from "@expo-google-fonts/scheherazade-new";

const width = Dimensions.get("window").width;

export default function Welcome() {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [place, setPlace] = useState(null);
	// const { setUserPlace, setUserLocation } = useAuth()

	// useEffect(() => {
	// 	(async () => {

	// 		let { status } = await Location.requestForegroundPermissionsAsync();
	// 		if (status !== 'granted') {
	// 			setErrorMsg('Permission to access location was denied');
	// 			return;
	// 		}

	// 		let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 0 });
	// 		setLocation(location);
	// 		setUserLocation(location)

	// 		let place = await Location.reverseGeocodeAsync({
	// 			latitude: location.coords.latitude,
	// 			longitude: location.coords.longitude
	// 		});
	// 		setPlace(place);
	// 		setUserPlace(place)
	// 	})();
	// }, []);


	let text = 'Loading..';

	if (errorMsg) {
		text = errorMsg;
	} else if (place) {
		// text = JSON.stringify(location);

		// form address string and also cater for missing data
		let address = '';
		if (place[0].name) address += place[0].name + ', ';
		if (place[0].street) address += place[0].street + ', ';
		if (place[0].city) address += place[0].city + ', ';
		if (place[0].region) address += place[0].region + ', ';
		if (place[0].country) address += place[0].country + ', ';
		if (place[0].postalCode) address += place[0].postalCode + ', ';
		if (place[0].isoCountryCode) address += place[0].isoCountryCode;

		text = address;
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
				<View className="flex-1 flex space-y-6 items-center justify-center px-10">
					<Image
						source={require("@assets/hadeeth-logo.png")}
						style={{ height: width / 1.8, resizeMode: "contain" }}
					/>

					<View>
						<Text
							style={styles.title}
							className="mt-5 text-center"
						>
							Ahlan Wa Sahlan !
						</Text>
						<Text
							className="mt-2 text-3xl text-center"
							style={styles.subTitle}
						>
							Welcome !
						</Text>
					</View>

					<Text className="mt-5 text-center" style={styles.baseText}>
						Learn more about our collection of Hadeeth
					</Text>

					<Text className="text-center" style={styles.locationText}>
						{text}
					</Text>

					<Link style={styles.button} href="/(auth)/SignIn" className="shadow-2xl overflow-hidden rounded-3xl flex items-center justify-center py-3 px-5 w-[160px] bg-[#1EAB53] border-transparent">
						<Text className="font-bold text-center text-white uppercase">
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
		fontSize: RFPercentage(2),
	},
	title: {
		fontSize: RFPercentage(5),
		fontFamily: "Langar"
	},
	subTitle: {
		fontSize: RFPercentage(4),
		fontFamily: "Langar",
	},
	baseText: {
		fontSize: RFPercentage(2.5),
		fontWeight: "medium"
	},
	locationText: {
		fontSize: RFPercentage(1.5),
	}
});
