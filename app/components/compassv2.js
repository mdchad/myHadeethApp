import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useAuth } from "@context/auth";
import { useSegments } from 'expo-router';

const Mecca = {
	latitude: 21.4225,
	longitude: 39.8262,
};

const width = Dimensions.get("window").width;

export default function App() {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [heading, setHeading] = useState(0);
	const { userLocation } = useAuth()
	const [loading, setLoading] = useState(true);
	const segment = useSegments();
	const [isQiblaPage, setIsQiblaPage] = useState(true);
	let _degree;

	useEffect(() => {
		_getLocationAsync();
		_watchHeading();
		setLoading(false);
	}, [userLocation]);

	const _getLocationAsync = async () => {
		if (!userLocation) return
		setLocation(userLocation);
	};

	const _watchHeading = () => {
		Location.watchHeadingAsync((heading) => {
			setHeading(heading.trueHeading);
		});
	};

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

	if (segment.includes('(qibla)')) {
		_degree = _getDegreeToMecca(location, heading);
		if (!_degree) return null

		// if degree is near 0 and 360, then vibrate
		if (_degree < 2 || _degree > 358) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>
				{/* True compass : {heading.toFixed(0)}° {_getDirection(heading)} */}
				Qibla Compass
			</Text>

			{loading ? <ActivityIndicator size="small" color="gray" /> : <View style={styles.compass}>
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
					transform: [{ rotate: `-${_degree}deg` }],
				}} />
			</View>
			}

			<Text style={styles.heading}>
				{_degree}°
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	heading: {
		fontSize: 24,
		textAlign: 'center',
		margin: 10,
		color: 'black'
	},
	text: {
		textAlign: 'center',
		color: 'black',
		marginBottom: 5,
	},
	compass: {
		// backgroundColor: 'red',
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
});
