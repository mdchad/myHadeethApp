import React, { useState, useEffect } from 'react'
import {
  Image,
  Text,
  View,
  Dimensions,
  ImageBackground,
  ScrollView,
  Button,
  Linking
} from 'react-native'
import * as Location from 'expo-location'
import * as Haptics from 'expo-haptics'
import { useAuth } from '@context/auth'
import { useSegments } from 'expo-router'
import { Skeleton } from 'moti/skeleton'
import Spacer from '@components/Spacer'
import Header from './header'
import SHARED_TEXT from '../i18n'

const Mecca = {
  latitude: 21.4225,
  longitude: 39.8262
}

const width = Dimensions.get('window').width

export default function CompassV2() {
  const [location, setLocation] = useState(null)
  const [heading, setHeading] = useState(0)
  const { userLocation, userPlace, permissionStatus } = useAuth()
  const segment = useSegments()
  const [degree, setDegree] = useState('')

  useEffect(() => {
    _getLocationAsync()
    _watchHeading()
    // setLoading(false)
  }, [userLocation])

  useEffect(() => {
    ;(async function asynccall() {
      if (segment.includes('(qibla)')) {
        let _degree = _getDegreeToMecca(location, heading)
        setDegree(_degree)
        if (!_degree) {
          return null
        }

        // if degree is near 0 and 360, then vibrate
        if (_degree < 2 || _degree > 358) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        }
      }
    })()
  }, [heading])

  const _getLocationAsync = async () => {
    if (!userLocation) {
      return
    }
    setLocation(userLocation)
  }

  async function _watchHeading() {
    await Location.watchHeadingAsync((heading) => {
      setHeading(heading.trueHeading)
    })
  }

  const _getDirection = (degree) => {
    const directionArr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']
    const index = Math.round(degree / 45)
    return directionArr[index]
  }

  const _getDegreeToMecca = (userLocation, heading = 0) => {
    if (!userLocation) return null

    // Convert latitude and longitude from degrees to radians
    const userLat = (userLocation.coords.latitude * Math.PI) / 180
    const userLng = (userLocation.coords.longitude * Math.PI) / 180
    const meccaLat = (Mecca.latitude * Math.PI) / 180
    const meccaLng = (Mecca.longitude * Math.PI) / 180

    // Calculate the great-circle distance between the two points using the Haversine formula
    const dLng = meccaLng - userLng
    const dLat = meccaLat - userLat
    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(userLat) * Math.cos(meccaLat) * Math.pow(Math.sin(dLng / 2), 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = 6371 * c // Earth's radius is approximately 6371 kilometers

    // Calculate the angle between the two points using the law of cosines
    const y = Math.sin(dLng) * Math.cos(meccaLat)
    const x =
      Math.cos(userLat) * Math.sin(meccaLat) -
      Math.sin(userLat) * Math.cos(meccaLat) * Math.cos(dLng)
    const angle = (Math.atan2(y, x) * 180) / Math.PI

    // Subtract the current heading from the angle to get the degree to turn to face Mecca
    const degree = angle - heading

    // Get the absolute value of the degree and use modulus operator to get the degree within the range of 0 to 360
    const positiveDegree = Math.abs(degree) % 360

    return positiveDegree ? positiveDegree.toFixed(0) : null
  }

  async function openSettings() {
    await Linking.openSettings()
  }

  return (
    <View className="h-full">
      <Header title={SHARED_TEXT.QIBLA_HEADER} />
      <ScrollView>
        {permissionStatus === 'denied' ? (
          <View className="mt-4 w-full">
            <Button
              title={SHARED_TEXT.ENABLE_LOCATION_LABEL}
              onPress={openSettings}
            />
          </View>
        ) : (
          <>
            <ImageBackground
              source={require('@assets/qibla-bg.png')}
              resizeMode="contain"
              style={{ width, height: width }}
            >
              <View className="mt-4 flex justify-center items-center">
                {degree ? (
                  <View className="mt-28 relative mb-6 flex justify-center items-center">
                    <Image
                      source={require('@assets/compass-v2.png')}
                      style={{
                        height: width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        resizeMode: 'contain',
                        transform: [{ rotate: `-${heading.toFixed(0)}deg` }],
                        position: 'relative'
                      }}
                    />

                    <Image
                      source={require('@assets/compass-needle.png')}
                      style={{
                        height: width / 1.1,
                        position: 'absolute',
                        top: -30,
                        // left: 0,
                        marginLeft: -20,
                        marginTop: 15,
                        resizeMode: 'contain',
                        transform: [{ rotate: `-${degree}deg` }]
                      }}
                    />
                  </View>
                ) : (
                  <>
                    <Skeleton
                      width={200}
                      height={200}
                      colorMode="light"
                      radius="round"
                    />
                    <Spacer height={20} />
                  </>
                )}
                {/*{ degree ? <View className={`${degree > 358 || degree < 2 ? "bg-green-300" : "bg-red-400"} p-3 rounded-xl w-1/3`}>*/}
                {/*	<Text className="text-white font-bold text-xl text-center">*/}
                {/*		{degree}°*/}
                {/*	</Text>*/}
                {/*</View>  : <Skeleton colorMode={'light'} width={'50%'} /> }*/}
                <View className="bg-royal-blue p-1 rounded-xl w-1/3">
                  <Text className="text-white font-bold text-2xl text-center">
                    {degree}°
                  </Text>
                </View>
              </View>
            </ImageBackground>
            <View className="mt-24">
              {degree && userPlace ? (
                <View className="px-8 py-4">
                  <Text className="text-xl font-semibold text-royal-blue">
                    {SHARED_TEXT.QIBLA_LOCATION_LABEL}
                  </Text>
                  <Text className="text-sm text-royal-blue">
                    {userPlace[0].city}
                    {userPlace[0].city && ','} {userPlace[0].country}
                  </Text>
                </View>
              ) : (
                <View className="px-8 py-4">
                  <Skeleton colorMode={'light'} width={'50%'} />
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}
