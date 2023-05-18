import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import {BookMinus, Clock, Compass, User} from "lucide-react-native";

const ImageLink = require('@assets/hadeeth-logo.png')

const _layout = () => {
  return (
    <View className="flex-1">
      <Tabs
        // initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingVertical: 10,
            width: 'auto',
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
          name="(hadeeth)"
          options={{
            tabBarLabel: 'Hadeeth',
            tabBarIcon: ({ focused }) => (
              <BookMinus size={18} color={focused ? 'tomato' : 'gray'} />
            ),
          }}
        />
        <Tabs.Screen
          name="(prayers)"
          options={{
            tabBarLabel: 'Prayers',
            tabBarIcon: ({ focused }) => (
              <Clock size={18} color={focused ? 'tomato' : 'gray'} />
            ),
          }}
        />
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarLabel: '',
            tabBarShowLabelabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -10, // space from bottombar
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Image source={ImageLink} style={{ width: 30, height: 30 }} />
                  {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                </View>
              )
            }
          }}
        />
        <Tabs.Screen
          name="(qibla)"
          options={{
            headerTitle: 'Qibla',
            headerShown: true,
            headerTitleStyle: {
              fontSize: 24,
            },
            headerStatusBarHeight: 60,
            headerTitleAllowFontScaling: true,
            tabBarLabel: 'Qibla',
            tabBarIcon: ({ focused }) => (
              <Compass size={18} color={focused ? 'tomato' : 'gray'} />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            headerShown: false,
            tabBarLabel: 'Profile',
            tabBarIcon: ({ focused }) => (
              <User size={18} color={focused ? 'tomato' : 'gray'} />
            ),
            headerStatusBarHeight: 60,
            headerTitleAllowFontScaling: true
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </View>
  )
}

export default _layout

