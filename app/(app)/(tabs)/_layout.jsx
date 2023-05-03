import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

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
              <FontAwesome5 name="book" size={16} color={focused ? 'tomato' : 'gray'} />
            ),
          }}
        />
        <Tabs.Screen
          name="(prayers)"
          options={{
            tabBarLabel: 'Prayers',
            tabBarIcon: ({ focused }) => (
              <FontAwesome5 name="mosque" size={16} color={focused ? 'tomato' : 'gray'} />
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
            tabBarLabel: 'Qibla',
            tabBarIcon: ({ focused }) => (
              <FontAwesome5 name="compass" size={16} color={focused ? 'tomato' : 'gray'} />
            ),
          }}
        />
        <Tabs.Screen
          name="(setting)"
          options={{
            headerTitle: 'Settings',
            headerShown: true,
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }) => (
              <FontAwesome5 name="cog" size={16} color={focused ? 'tomato' : 'gray'} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </View>
  )
}

export default _layout

