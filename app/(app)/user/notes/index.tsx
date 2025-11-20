import { View, Text } from 'react-native'
import React from 'react'
import Page from '@/app/components/page'

const Notes = () => {
  return (
    <Page edges={['top']} className="bg-gray-100">
      <View className="flex-1 bg-gray-100">
        <Text>Hello</Text>
      </View>
    </Page>
  )
}

export default Notes
