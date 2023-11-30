import React from 'react'
import { View, ScrollView } from 'react-native'
import Page from '@components/page'
import { WebView } from 'react-native-webview';

export default function Settings() {

  return (
    <Page class="bg-gray-100">
      <ScrollView className="py-4">
        <View className="px-4 bg-gray-100 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          <WebView></WebView>
        </View>
      </ScrollView>
    </Page>
  )
}
