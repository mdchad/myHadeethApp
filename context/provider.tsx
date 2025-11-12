import React, { useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import * as Location from 'expo-location'
import type { UserLocation, UserPlace } from '../app/types'

export interface ProviderContextType {
  userLocation: Location.LocationObject | null;
  userPlace: Location.LocationGeocodedAddress[] | null;
  permissionStatus: Location.PermissionStatus | null;
  setUserLocation: (location: Location.LocationObject | null) => void;
  setUserPlace: (place: Location.LocationGeocodedAddress[] | null) => void;
}

const AuthContext = React.createContext<ProviderContextType | null>(null)

// This hook can be used to access the user info.
export function useProvider() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useProvider must be used within a Provider')
  }
  return context
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

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  const [userLocation, setUserLocation] = React.useState<Location.LocationObject | null>(null)
  const [userPlace, setUserPlace] = React.useState<Location.LocationGeocodedAddress[] | null>(null)
  const [permissionStatus, setPermissionStatus] = React.useState<Location.PermissionStatus | null>(null)
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState<AppStateStatus>(appState.current)
  const focusEvent = Platform.OS === 'android' ? 'focus' : 'change'

  useEffect(() => {
    const subscription = AppState.addEventListener(
      focusEvent,
      (nextAppState) => {
        if (
          Platform.OS === 'ios' &&
          appState?.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!')
        }

        appState.current = nextAppState
        setAppStateVisible(appState.current)

        if (appState.current === 'active') {
          ;(async () => {
            try {
              let { status } = await Location.requestForegroundPermissionsAsync()
              if (status !== 'granted') {
                setPermissionStatus(status)
                return
              } else {
                setPermissionStatus(status)
              }

              let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                distanceInterval: 0
              })

              let place = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              })

              setUserPlace(place)
              setUserLocation(location)
            } catch (e) {
              console.error(e)
            }
          })()
        }
      }
    )

    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setPermissionStatus(status)
        return
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
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
        setUserLocation: (location: Location.LocationObject | null) => setUserLocation(location),
        userLocation,
        userPlace,
        permissionStatus,
        setUserPlace: (place: Location.LocationGeocodedAddress[] | null) => setUserPlace(place)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
