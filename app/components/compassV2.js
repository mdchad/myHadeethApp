import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useAuth } from "@context/auth";
import { useSegments } from 'expo-router';
import {Skeleton} from "moti/skeleton";
import Spacer from "@components/Spacer";

const Mecca = {
	latitude: 21.4225,
	longitude: 39.8262,
};

const width = Dimensions.get("window").width;

export default function CompassV2() {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [heading, setHeading] = useState(0);
	const { userLocation } = useAuth()
	// const [loading, setLoading] = useState(true);
	const segment = useSegments();
	const [isQiblaPage, setIsQiblaPage] = useState(true);
	const [degree, setDegree] = useState('')

	useEffect(() => {
		_getLocationAsync();
		_watchHeading();
		// setLoading(false)
	}, [userLocation]);

	useEffect(() => {
		(async function asynccall() {
			if (segment.includes('(qibla)')) {
				let _degree = _getDegreeToMecca(location, heading);
				setDegree(_degree)
				if (!_degree){
					return <Text>oii</Text>
				}

				// if degree is near 0 and 360, then vibrate
				if (_degree < 2 || _degree > 358) {
					await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
				}
			}
		})()
	}, [heading])

	const _getLocationAsync = async () => {
		if (!userLocation) {
			return
		}
		setLocation(userLocation);
	};

	async function  _watchHeading() {
		await Location.watchHeadingAsync((heading) => {
			setHeading(heading.trueHeading);
		});
	}

	const _getDirection = (degree) => {
		const directionArr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
		const index = Math.round(degree / 45);
		return directionArr[index];
	};

	const _getDegreeToMecca = (userLocation, heading = 0) => {
		if (!userLocation) return null;

		// Convert latitude and longitude from degrees to radians
		const userLat = userLocation.coords.latitude * Math.PI / 180;
		const userLng = userLocation.coords.longitude * Math.PI / 180;
		const meccaLat = Mecca.latitude * Math.PI / 180;
		const meccaLng = Mecca.longitude * Math.PI / 180;

		// Calculate the great-circle distance between the two points using the Haversine formula
		const dLng = meccaLng - userLng;
		const dLat = meccaLat - userLat;
		const a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(userLat) * Math.cos(meccaLat) * Math.pow(Math.sin(dLng / 2), 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = 6371 * c; // Earth's radius is approximately 6371 kilometers

		// Calculate the angle between the two points using the law of cosines
		const y = Math.sin(dLng) * Math.cos(meccaLat);
		const x = Math.cos(userLat) * Math.sin(meccaLat) - Math.sin(userLat) * Math.cos(meccaLat) * Math.cos(dLng);
		const angle = Math.atan2(y, x) * 180 / Math.PI;

		// Subtract the current heading from the angle to get the degree to turn to face Mecca
		const degree = angle - heading;

		// Get the absolute value of the degree and use modulus operator to get the degree within the range of 0 to 360
		const positiveDegree = (Math.abs(degree) % 360);

		return positiveDegree ? positiveDegree.toFixed(0) : null;
	};

	return (
		<View className="flex h-full justify-center items-center">
			{degree ? <View className="relative mb-6 flex justify-center items-center">
				<Image
					source={require('@assets/kompas.png')}
					style={{
						height: width,
						justifyContent: 'center',
						alignItems: 'center',
						resizeMode: 'contain',
						transform: [{ rotate: `-${heading.toFixed(0)}deg` }],
						position: 'relative',
					}}
				/>

				<Image source={require("@assets/qibla_needle.png")} style={{
					height: width / 1.1,
					position: 'absolute',
					top: 0,
					// left: 0,
					marginLeft: -20,
					marginTop: 15,
					resizeMode: 'contain',
					transform: [{ rotate: `-${degree}deg` }],
				}} />
			</View> : (
				<>
					<Skeleton width={200} height={200} colorMode="light" radius="round" />
					<Spacer height={20} />
				</>
			)}
			{ degree ? <View className={`${degree > 358 || degree < 2 ? "bg-green-300" : "bg-red-400"} p-3 rounded-xl w-1/3`}>
				<Text className="text-white font-bold text-xl text-center">
					{degree}°
				</Text>
			</View> : <Skeleton colorMode={'light'} width={'50%'} /> }
		</View>
	);
}