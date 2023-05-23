import React from 'react'
import {Stack, useRouter} from 'expo-router'
import {ArrowLeft} from "lucide-react-native";
import {Pressable} from "react-native";

export const unstable_settings = {
  initialRouteName: 'index'
}

const _layout = () => {
  const router = useRouter()

  return (
    <Stack
      initialRouteName='index'
      screenOptions={{
        headerShown: true,
        headerTitle: 'Settings',
        headerLeft: () => <Pressable onPress={() => router.back()}><ArrowLeft size={25} color={'black'}/></Pressable>,
        headerTitleAllowFontScaling: true,
        headerTitleStyle: {
          fontSize: 24,
        },
    }}
    />
  )
}

export default _layout