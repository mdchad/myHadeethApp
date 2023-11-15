import { View, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { SearchIcon } from "lucide-react-native";

const homeLogo = require('@assets/home.png')
const prayerLogo = require('@assets/prayer.png')
const qiblaLogo = require('@assets/qibla.png')
const settingsLogo = require('@assets/settings.png')
const hadithLogo = require('@assets/hadith.png')

const _layout = () => {
  return (
    <View className="flex-1">
      <Tabs
        // initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'rgb(209,213,219)',
          tabBarStyle: {
            paddingVertical: 10,
            width: 'auto',
            backgroundColor: '#1C2A4F'
          },
          tabBarLabelStyle: {
            // fontSize: 12,
            margin: 0,
            paddingTop: 0,
            paddingBottom: 5,

          }
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            href: null,
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={homeLogo} style={{ width: 20, height: 20 }} />
                  {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                </View>
              )
            }
          }}
        />
        <Tabs.Screen
          name="(hadeeth)"
          options={{
            tabBarLabel: 'Hadith',
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={hadithLogo} style={{ width: 20, height: 20 }} />
                  {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                </View>
              )
            }
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <SearchIcon size={22} color={'white'} />
                  {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                </View>
              )
            }
          }}
        />
        <Tabs.Screen
          name="(prayers)"
          options={{
            tabBarLabel: 'Prayer',
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={prayerLogo} style={{ width: 20, height: 20 }} />
                  {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                </View>
              )
            }
          }}
        />
        <Tabs.Screen
          name="(qibla)"
          options={{
            tabBarLabel: 'Qibla',
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={qiblaLogo} style={{ width: 20, height: 20 }} />
                  {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                </View>
              )
            }
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            headerShown: false,
            tabBarLabel: 'Settings',
            headerStatusBarHeight: 60,
            headerTitleAllowFontScaling: true,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={settingsLogo} style={{ width: 20, height: 20 }} />
                  {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                </View>
              )
            },
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </View>
  )
}

export default _layout

