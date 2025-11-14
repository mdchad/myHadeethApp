import { View, Text, ScrollView, Image, TouchableHighlight } from 'react-native'
import React from 'react'
import Page from '@/app/components/page'

const Saved = () => {
  return (
    <Page className="bg-white">
      <ScrollView className="py-4">
        <View className="flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          <View className="py-6">
            <Text>All the saved</Text>
          </View>
        </View>
      </ScrollView>
    </Page>
  )
}

export default Saved
