import { View, SafeAreaView } from 'react-native'
import React from 'react'

// this component is used to wrap the content of each page
// with keyboard dismiss and to prevent code repetition

const Page = ({ children, ...props }) => {
  return (
    <SafeAreaView className={`flex-1 ${props.class}`}>
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  )
}

export default Page
