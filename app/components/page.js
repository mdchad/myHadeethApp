import { View, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native'
import React from 'react'
import { useSegments } from 'expo-router'

// this component is used to wrap the content of each page 
// with keyboard dismiss and to prevent code repetition

const Page = ({ children, ...props }) => {
  const segment = useSegments();

  // check if segment includes (hadeeth)
  const isHadeeth = segment.includes('(hadeeth)')

  return (
    <SafeAreaView className={`flex-1 ${props.class}`}>
      <View className="flex-1">
        {children}
      </View>
    </SafeAreaView>
  )
}

export default Page