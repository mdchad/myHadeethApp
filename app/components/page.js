import {View, Platform, StatusBar, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'

// this component is used to wrap the content of each page
// with keyboard dismiss and to prevent code repetition

const Page = ({ children, edges = [], ...props }) => {
  return (
    <SafeAreaView className={`flex-1 ${props.class}`} edges={['top', ...edges]}>
      <View className={`flex-1`} style={style}>{children}</View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
});

export default Page

