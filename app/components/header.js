import { View, Text, TextInput, Pressable } from 'react-native'
import React from 'react'
import { ChevronLeftCircle, SearchIcon, User } from 'lucide-react-native'

function Header({ title, onPressButton, search, rounded = true }) {
  return (
    <View className="bg-gray-100">
      <View
        className={`flex ${
          rounded && 'rounded-b-2xl'
        } py-6 shadow-lg bg-royal-blue overflow-hidden`}
      >
        <View className="flex flex-row w-full justify-center relative">
          {onPressButton && (
            <Pressable
              className="border-transparent absolute left-5"
              onPress={onPressButton}
            >
              <ChevronLeftCircle color={'white'} size={28}></ChevronLeftCircle>
            </Pressable>
          )}
          <Text className="text-white text-xl font-semibold">{title}</Text>
        </View>
        {search && (
          <View className="mt-4 px-6 w-full">
            <View className="bg-white rounded-2xl shadow w-full">
              <TextInput
                className="px-4 py-2"
                placeholder="Search for Hadith, Books, Etc"
                onChangeText={(text) => search(text)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default Header
