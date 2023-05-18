import { useRouter, useSegments } from "expo-router";
import React, {useEffect} from "react";
import * as Location from "expo-location";
import {View} from "react-native";
import {useUser} from "@clerk/clerk-expo";

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
// function useProtectedRoute(user) {
//   const segments = useSegments();
//   const router = useRouter();
//
//   React.useEffect(() => {
//     const inAuthGroup = segments[0] === "(auth)";
//
//     if (
//       // If the user is not signed in and the initial segment is not anything in the auth group.
//       !user &&
//       !inAuthGroup
//     ) {
//       // Redirect to the sign-in page.
//       router.replace("/Welcome");
//     } else if (user && inAuthGroup) {
//       // Redirect away from the sign-in page.
//       router.replace("/(hadeeth)");
//     }
//   }, [user, segments]);
// }

export function Provider(props) {
  const { user } = useUser()
  const [userLocation, setUserLocation] = React.useState(null);
  const [userPlace, setUserPlace] = React.useState(null);

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      // if (status !== 'granted') {
      //   setErrorMsg('Permission to access location was denied');
      //   return;
      // }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 0 });
      // setLocation(location);
      setUserLocation(location)

      let place = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      // setPlace(place);
      setUserPlace(place)
    })();
  }, []);

  // useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserLocation: (location) => setUserLocation(location),
        userLocation,
        userPlace,
        setUserPlace: (place) => setUserPlace(place)
      }}
    >
        {props.children}
    </AuthContext.Provider>
  );
}