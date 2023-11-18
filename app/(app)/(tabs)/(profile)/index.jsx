import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Share,
  Alert
} from 'react-native'

import Page from '@components/page'
import {
  Bookmark,
  FileText,
  LogIn,
  LogOut,
  MessageSquare,
  Settings,
  Smartphone,
  User,
  Users
} from 'lucide-react-native'
import Header from '../../../components/header'
import * as WebBrowser from 'expo-web-browser'

export default function Profile() {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Salam, download the best app for hadith for free now at https://myhadeeth.com'
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  return (
    <Page class="bg-white w-full">
      <ScrollView>
        <Header title="Settings" rounded={false} />
        <View
          className={`w-full flex items-center h-10 rounded-b-2xl bg-royal-blue`}
        >
          <View className="">
            {/*{ user ? (*/}
            {/*  <Image source={{ uri: user.profileImageUrl }} style={{ width: 80, height: 80, borderRadius: 100 }} />*/}
            {/*) : (*/}
            <View className="rounded-full flex items-center justify-center h-20 w-20 bg-gray-200">
              <User color="black" />
            </View>
            {/*)}*/}
          </View>
          <View className="flex items-center mt-2">
            {/*{ user ? (*/}
            {/*  <>*/}
            {/*    <Text className="mb-1 text-royal-blue">{user.fullName}</Text>*/}
            {/*    <Text className="text-royal-blue">{user.primaryEmailAddress.emailAddress}</Text>*/}
            {/*  </>*/}
            {/*) : (*/}
            <>
              <Text className="mb-1 text-royal-blue">Guest</Text>
            </>
            {/*)}*/}
          </View>
        </View>
        <View className="mt-12 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          <View className="py-6">
            <View className="border-b border-b-gray-300 mx-6 mt-8"></View>
            <TouchableHighlight underlayColor="#f9fafb" onPress={onShare}>
              <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">
                <Users color="black" size={20} />
                <Text className="text-lg">Share this app</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  'https://my-way-web.vercel.app/#faqs'
                )
              }
            >
              <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">
                <MessageSquare size={20} color={'black'} />
                <Text className="text-lg">Help and Feedback</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() =>
                WebBrowser.openBrowserAsync('https://my-way-web.vercel.app')
              }
              className="rounded-b-xl"
              underlayColor="#f9fafb"
            >
              <View className="mx-5 py-3 space-x-3 flex flex-row items-center">
                <Smartphone color={'black'} size={20} />
                <Text className="text-lg">About</Text>
              </View>
            </TouchableHighlight>
            {/*<Link href="/settings" asChild>*/}
            {/*  <TouchableHighlight underlayColor="#f9fafb">*/}
            {/*    <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">*/}
            {/*      <Settings color="black" size={20}/>*/}
            {/*      <Text className="text-lg">Settings</Text>*/}
            {/*    </View>*/}
            {/*  </TouchableHighlight>*/}
            {/*</Link>*/}
            {/*<Link href="/logout" asChild>*/}
            {/*  <TouchableHighlight underlayColor="#f9fafb">*/}
            {/*    <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">*/}
            {/*      <LogOut color="red" size={20}/>*/}
            {/*      <Text className="text-lg text-red-600">Logout</Text>*/}
            {/*    </View>*/}
            {/*  </TouchableHighlight>*/}
            {/*</Link>*/}
          </View>
        </View>
      </ScrollView>
    </Page>
  )
}
