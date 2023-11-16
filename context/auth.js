import { useRouter, useSegments } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import * as Location from 'expo-location'
import { View } from 'react-native'

const AuthContext = React.createContext(null)

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext)
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
  const [userLocation, setUserLocation] = React.useState(null)
  const [userPlace, setUserPlace] = React.useState(null)
  const [permissionStatus, setPermissionStatus] = React.useState(null)
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!')
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)

      if (appState.current === 'active') {
        ;(async () => {
          let { status } = await Location.requestForegroundPermissionsAsync()
          if (status !== 'granted') {
            setPermissionStatus(status)
            return
          } else {
            setPermissionStatus(status)
          }

          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 0
          })

          let place = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          })

          setUserPlace(place)
          setUserLocation(location)
        })()
      }
    })

    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setPermissionStatus(status)
        return
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 0
      })

      let place = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })

      setUserPlace(place)
      setUserLocation(location)
    })()

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        setUserLocation: (location) => setUserLocation(location),
        userLocation,
        userPlace,
        permissionStatus,
        setUserPlace: (place) => setUserPlace(place)
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
