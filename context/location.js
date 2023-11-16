import React, { useState, useEffect, createContext } from 'react'
import * as Location from 'expo-location'

const LocationContext = createContext({ location: null })

export function useLocation() {
  return React.useContext(LocationContext)
}

export function LocationProvider(props) {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 0
      })
      setLocation(location)
    })()
  }, [])

  return (
    <LocationContext.Provider
      value={{
        location
      }}
    >
      {props.children}
    </LocationContext.Provider>
  )
}
