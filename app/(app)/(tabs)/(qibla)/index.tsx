import { Text, View } from 'react-native'
import React from 'react'
import Page from '@components/page'
import Compass from '@components/compassV2'

const Qiblat = () => {
  return (
    <Page class="bg-gray-100">
      <View className="flex-1 bg-gray-100">
        <Compass />
      </View>
    </Page>
  )
}

export default Qiblat
