import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Switch, TouchableHighlight, Platform } from 'react-native'

import Page from '@/app/components/page'
import {
  BellRing,
  Hourglass,
  MessageSquare,
  Smartphone
} from 'lucide-react-native'
import { Link, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as WebBrowser from 'expo-web-browser'

export default function Settings() {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState(false)
  const [date, setDate] = useState(new Date(1598051730000))
  const [mode, setMode] = useState('time')
  const [show, setShow] = useState(false)

  const onChange = (event: unknown, selectedDate?: Date) => {
    setShow(false)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const showMode = (currentMode: string) => {
    if (Platform.OS === 'android') {
      setShow(false)
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  return (
    <Page edges={['top']} className="bg-royal-blue-950">
      <ScrollView className="py-4">
        <View className="px-4 bg-gray-100 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          <View className="bg-white rounded-xl flex">
            <View className="bg-white rounded-xl space-x-3 px-4 py-2 flex flex-row items-center justify-between w-full">
              <View className="space-x-3 items-center flex flex-row">
                <BellRing color="black" size={20} />
                <Text className="text-lg">Notification</Text>
              </View>
              <Switch
                trackColor={{ false: '#d1d5db', true: '#5BC236' }}
                thumbColor={isEnabled ? '#FFF' : '#f4f3f4'}
                ios_backgroundColor="#d1d5db"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            {isEnabled && (
              <View className="bg-white rounded-xl space-x-3 px-4 py-2 flex flex-row items-center justify-between w-full">
                <View className="w-full space-x-3 justify-between items-center flex flex-row">
                  <View className="space-x-3 items-center flex flex-row">
                    <Hourglass color="black" size={20} />
                    <Text className="text-lg">Daily hadith time</Text>
                  </View>
                  {/*<View>*/}
                  {/*    <DateTimePicker*/}
                  {/*      testID="dateTimePicker"*/}
                  {/*      value={date}*/}
                  {/*      mode={mode}*/}
                  {/*      is24Hour={true}*/}
                  {/*    />*/}
                  {/*</View>*/}
                </View>
              </View>
            )}
          </View>
          <Text className="ml-5 mb-4 mt-2 text-gray-600">
            Show hadith notification daily
          </Text>
          <View className="bg-white rounded-xl flex">
            <View className="mx-5 space-x-3 py-3 flex flex-row items-center border-b border-gray-300">
              <MessageSquare size={20} color={'black'} />
              <Text className="text-lg">Help and Feedback</Text>
            </View>
            <TouchableHighlight
              onPress={() => WebBrowser.openBrowserAsync('https://expo.dev')}
              className="rounded-b-xl bg-white"
              underlayColor="#f9fafb"
            >
              <View className="mx-5 py-3 space-x-3 flex flex-row items-center">
                <Smartphone color={'black'} size={20} />
                <Text className="text-lg">About</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    </Page>
  )
}
