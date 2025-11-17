import { create } from 'zustand'
import * as Location from 'expo-location'
import { AppState, AppStateStatus, Platform } from 'react-native'

interface LocationState {
  userLocation: Location.LocationObject | null
  userPlace: Location.LocationGeocodedAddress[] | null
  permissionStatus: Location.PermissionStatus | null
  setUserLocation: (location: Location.LocationObject | null) => void
  setUserPlace: (place: Location.LocationGeocodedAddress[] | null) => void
  setPermissionStatus: (status: Location.PermissionStatus | null) => void
  fetchLocation: () => Promise<void>
  initializeLocationTracking: () => () => void
}

export const useLocationStore = create<LocationState>((set, get) => ({
  userLocation: null,
  userPlace: null,
  permissionStatus: null,

  setUserLocation: (location) => set({ userLocation: location }),
  setUserPlace: (place) => set({ userPlace: place }),
  setPermissionStatus: (status) => set({ permissionStatus: status }),

  // Fetch location and update store
  fetchLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      get().setPermissionStatus(status)

      if (status !== 'granted') {
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 0
      })

      const place = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })

      get().setUserPlace(place)
      get().setUserLocation(location)
    } catch (e) {
      console.error('[LocationStore] Error fetching location:', e)
    }
  },

  // Initialize location tracking with AppState listener
  initializeLocationTracking: () => {
    const appState = { current: AppState.currentState }
    const focusEvent = Platform.OS === 'android' ? 'focus' : 'change'

    // Fetch location on initialization
    get().fetchLocation()

    // Set up AppState listener
    const subscription = AppState.addEventListener(
      focusEvent,
      (nextAppState: AppStateStatus) => {
        if (
          Platform.OS === 'ios' &&
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('[LocationStore] App has come to the foreground!')
        }

        appState.current = nextAppState

        // Fetch location when app becomes active
        if (appState.current === 'active') {
          get().fetchLocation()
        }
      }
    )

    // Return cleanup function
    return () => {
      subscription.remove()
    }
  }
}))
