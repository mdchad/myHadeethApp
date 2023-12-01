import {
  View,
  Text,
  FlatList,
  ImageBackground, Pressable
} from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import Header from '@components/header'
import { ArrowRight, Bookmark, Heart, Share2 } from 'lucide-react-native'
import { useGetBooks } from '../../../shared/fetcher/useBooks'
import SHARED_TEXT from "../../../i18n";

function Item({ title, id }) {
  const words = title.split(' ')

  const firstWord = words[0]
  const remainingWords = words.slice(1).join(' ')

  return (
    <Link
      href={`(hadeeth)/volume/${id}?title=${title}`}
      asChild
    >
      <Pressable className="w-[48%] mr-4 bg-white">
        <View className="w-full">
          <View className="flex items-center py-8 px-2">
            <Text className="text-lg text-royal-blue font-semibold">
              {firstWord}
            </Text>
            <Text className="text-lg text-royal-blue font-semibold">
              {remainingWords}
            </Text>
          </View>
          <View className="bg-royal-blue w-full p-1 flex flex-row justify-between items-center">
            <Text className="text-white text-xs mr-1">{SHARED_TEXT.VIEW_MORE_LABEL}</Text>
            <ArrowRight color="white" size={12} />
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

function Books() {
  const { isLoading, isError, data, error } = useGetBooks()

  return (
    <>
      <Header title={SHARED_TEXT.BOOKS_HEADER}></Header>
      <View className="flex-1 bg-gray-100">
        <ImageBackground
          source={require('@assets/book-background.png')}
          resizeMode="cover"
          style={{ flex: 1, justifyContent: 'end', alignItems: 'end' }}
        >
          <View className="mb-4 mt-4">
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Item title={item.title} id={item.id} />
              )}
              keyExtractor={(item) => item.id}
              className="h-full"
              numColumns={2}
              columnWrapperStyle={{
                flex: 1,
                width: '100%',
                padding: 14
              }}
            />
          </View>
        </ImageBackground>
      </View>
    </>
  )
}

export default Books
