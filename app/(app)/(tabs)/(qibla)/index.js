import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Page from '@components/page'
import * as Location from 'expo-location';
import { Gyroscope } from 'expo-sensors';
import Compass from '@components/compassv2';
// import Compass from '@components/compass';
import { useAuth } from "@context/auth";

const Qiblat = () => {
  // use userLocation for current user location
  // const { userLocation } = useAuth()
  // let user = { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }
  // let _Mecca = { latitude: 21.42252, longitude: 39.82621 };

  // useEffect(() => {
  //   console.log(user)
  // }, [user])

  return (
    <Page>
      <View className="flex-1 bg-[#EDEEC0]">
        <Compass />
      </View>
    </Page >
  )
}

export default Qiblat