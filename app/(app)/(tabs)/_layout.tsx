import { View, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import {
  ClockIcon,
  HomeIcon,
  LayoutGridIcon,
  SearchIcon,
  SparklesIcon
} from 'lucide-react-native'
import SHARED_TEXT from '../../i18n'
import { t } from 'i18next'

const homeLogo = require('@/assets/home.png')
const prayerLogo = require('@/assets/prayer.png')
const qiblaLogo = require('@/assets/qibla.png')
const settingsLogo = require('@/assets/settings.png')
const hadithLogo = require('@/assets/hadith.png')

const _layout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgb(209,213,219)',
        tabBarStyle: {
          width: 'auto',
          backgroundColor: '#1C2A4F'
        },
        tabBarIconStyle: {
          marginTop: 2
        },
        tabBarLabelStyle: {
          margin: 0,
          paddingTop: 2,
          fontWeight: 'bold'
        },
        sceneStyle: { backgroundColor: '#1C2A4F' }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t(SHARED_TEXT.TAB_HOME_LABEL),
          tabBarIcon: ({ focused }) => {
            return (
              <HomeIcon size={22} color={focused ? 'white' : '#d1d1d1'} />
              // <View
              //   style={{
              //     justifyContent: 'center',
              //     alignItems: 'center'
              //   }}
              // >
              //   <Image source={homeLogo} style={{ width: 20, height: 20 }} />
              // </View>
            )
          }
        }}
      />
      <Tabs.Screen
        name="(hadeeth)"
        options={{
          tabBarLabel: t(SHARED_TEXT.TAB_HADITH_LABEL),
          tabBarIcon: ({ focused }) => {
            return (
              <LayoutGridIcon size={22} color={focused ? 'white' : '#d1d1d1'} />
              // <View
              //   style={{
              //     justifyContent: 'center',
              //     alignItems: 'center'
              //   }}
              // >
              //   <Image
              //     source={hadithLogo}
              //     style={{ width: 20, height: 20 }}
              //   />
              // </View>
            )
          }
        }}
      />
      <Tabs.Screen
        name="(tanya)"
        options={{
          tabBarLabel: t(SHARED_TEXT.TAB_TANYA_LABEL),
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => {
            return (
              <SparklesIcon size={22} color={focused ? 'white' : '#d1d1d1'} />
            )
          }
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          tabBarLabel: t(SHARED_TEXT.TAB_SEARCH_LABEL),
          tabBarIcon: ({ focused }) => {
            return (
              <SearchIcon size={22} color={focused ? 'white' : '#d1d1d1'} />
              // <View
              //   style={{
              //     justifyContent: 'center',
              //     alignItems: 'center'
              //   }}
              // >
              //   <SearchIcon size={22} color={'white'} />
              //   {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
              // </View>
            )
          }
        }}
      />
      <Tabs.Screen
        name="(prayers)"
        options={{
          href: null,
          tabBarLabel: t(SHARED_TEXT.TAB_PRAYER_LABEL),
          tabBarIcon: ({ focused }) => {
            return (
              <ClockIcon size={22} color={focused ? 'white' : '#d1d1d1'} />
              // <View
              //   style={{
              //     justifyContent: 'center',
              //     alignItems: 'center'
              //   }}
              // >
              //   <Image
              //     source={prayerLogo}
              //     style={{ width: 20, height: 20 }}
              //   />
              //   {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
              // </View>
            )
          }
        }}
      />
      <Tabs.Screen
        name="(qibla)"
        options={{
          href: null,
          tabBarLabel: t(SHARED_TEXT.TAB_QIBLA_LABEL),
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image source={qiblaLogo} style={{ width: 20, height: 20 }} />
                {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
              </View>
            )
          }
        }}
      />
    </Tabs>
  )
}

export default _layout
