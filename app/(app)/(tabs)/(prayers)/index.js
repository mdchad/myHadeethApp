import { View, Text } from 'react-native'
import React from 'react'
import Page from '../../../components/page'
import Audio from '../../../components/audio'

const Prayers = () => {
  return (
    <Page className="flex-1 bg-white p-5">
      <Text>Prayers</Text>

        <Audio />
    </Page>
  )
}

export default Prayers