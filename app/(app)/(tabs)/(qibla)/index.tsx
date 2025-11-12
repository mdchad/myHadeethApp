import { Text, View } from 'react-native'
import React from 'react'
import Page from '@/app/components/page'
import Compass from '@/app/components/compassV2'

const Qiblat = () => {
  return (
    <Page class="bg-gray-100">
      <View className="bg-gray-100">
        <Compass />
      </View>
    </Page>
  )
}

export default Qiblat
