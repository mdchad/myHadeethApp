import {
  View,
  Text,
  FlatList,
  ImageBackground, Pressable, StatusBar
} from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import Header from '@/app/components/header'
import useGetBooks from '@/app/shared/fetcher/useBooks'
import SHARED_TEXT from "@/app/i18n";
import {t} from "i18next";
import Page from '@/app/components/page'
import { usePostHog } from 'posthog-react-native'
import { useQueryClient } from '@tanstack/react-query'
import { apiGet } from '@/app/utils/api'

interface ItemProps {
  title: string;
  id: string;
}

function Item({ title, id }: ItemProps) {
  const posthog = usePostHog()
  const queryClient = useQueryClient()

  const handlePress = () => {
    posthog.capture('hadith_book_opened', {
      book_id: id,
      book_title: title
    })
  }

  // Prefetch volumes when user presses the book
  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['volumes', id],
      queryFn: async () => {
        const result = await apiGet(`/api/books/${id}`)
        return result.data
      }
    })
  }

  const words = title.split(' ')

  const firstWord = words[0]
  const remainingWords = words.slice(1).join(' ')

  return (
    <Link
      href={{
        pathname: '/(app)/(tabs)/(hadeeth)/volume/[id]',
        params: { id: id, title: title },
      }}
      asChild
    >
      <Pressable
        className="w-[48%] mr-4 bg-white"
        onPress={handlePress}
        onPressIn={handlePrefetch}
      >
        <View className="w-full">
          <View className="flex items-center py-8 px-2">
            <Text className="text-lg text-royal-blue-950 font-semibold">
              {firstWord}
            </Text>
            <Text className="text-lg text-royal-blue-950 font-semibold">
              {remainingWords}
            </Text>
          </View>
          <View className="bg-royal-blue-950 w-full p-1 items-end">
            <Text className="text-white text-xs mr-1">
              {t(SHARED_TEXT.VIEW_MORE_LABEL)}
              {''} →
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

function Books() {
  const { isLoading, isError, data, error } = useGetBooks()

  return (
    <Page edges={['top']} className="bg-royal-blue-950">
      <StatusBar barStyle="light-content" />
      <Header title={t(SHARED_TEXT.BOOKS_HEADER)} ></Header>
      <View className="bg-gray-100">
        <ImageBackground
          source={require('@/assets/book-background.png')}
          resizeMode="cover"
        >
          <View className="mb-4 mt-4">
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Item title={item.title_ms} id={item.id} />
              )}
              keyExtractor={(item) => item.id}
              className="h-full"
              numColumns={2}
              columnWrapperClassName={'p-4'}
            />
          </View>
        </ImageBackground>
      </View>
    </Page>
  )
}

export default Books
