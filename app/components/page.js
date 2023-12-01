import {View, SafeAreaView, Platform, StatusBar, StyleSheet} from 'react-native'
import React from 'react'

// this component is used to wrap the content of each page
// with keyboard dismiss and to prevent code repetition

const Page = ({ children, ...props }) => {
  return (
    <SafeAreaView className={`flex-1 ${props.class}`}>
      <View className={`flex-1`} style={style}>{children}</View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
});

export default Page

