import {
  View,
  Text,
  FlatList,
  Image,
  Pressable, StatusBar
} from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import Header from '@/app/components/header'
import useGetBooks from '@/app/shared/fetcher/useBooks'
import SHARED_TEXT from "@/app/i18n";
import {t} from "i18next";
import Page from '@/app/components/page'
import ErrorState from '@/app/components/error-state'
import { usePostHog } from 'posthog-react-native'
import { useQueryClient } from '@tanstack/react-query'
import { apiGet } from '@/app/utils/api'

interface ItemProps {
  title: string;
  id: string;
  slug: string;
}

// Covers are matched by substring since API slugs and local filenames differ
// (e.g. slug "bukhari" → sahih_bukhari.webp).
const BOOK_COVERS: { matches: string[]; source: number; arabic: string }[] = [
  { matches: ['bukhari'], source: require('@/assets/books/sahih_bukhari.webp'), arabic: 'صحيح البخاري' },
  { matches: ['muslim'], source: require('@/assets/books/sahih_muslim.webp'), arabic: 'صحيح مسلم' },
  { matches: ['daud', 'dawud', 'dawood'], source: require('@/assets/books/sunan_abu_daud.webp'), arabic: 'سنن أبي داود' },
  { matches: ['tirmidhi', 'tirmizi'], source: require('@/assets/books/jami_tirmidhi.webp'), arabic: 'جامع الترمذي' },
  { matches: ['majah'], source: require('@/assets/books/sunan_ibn_majah.webp'), arabic: 'سنن ابن ماجه' },
  { matches: ['nasai', 'nasaie'], source: require('@/assets/books/sunan_al_nasai.webp'), arabic: 'سنن النسائي' },
]

function getBookCover(slug: string, title: string) {
  const haystack = `${slug ?? ''} ${title ?? ''}`.toLowerCase()
  return BOOK_COVERS.find((cover) =>
    cover.matches.some((m) => haystack.includes(m))
  )
}

function Item({ title, id, slug }: ItemProps) {
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

  const cover = getBookCover(slug, title)

  return (
    <Link
      href={{
        pathname: '/(app)/(tabs)/(hadeeth)/volume/[id]',
        params: { id: id, title: title },
      }}
      asChild
    >
      <Pressable
        testID={`book-${slug}`}
        className="w-[47%]"
        onPress={handlePress}
        onPressIn={handlePrefetch}
      >
        <View className="w-full aspect-[3/4] rounded-md bg-white shadow-md">
          {cover ? (
            <Image
              source={cover.source}
              className="w-full h-full rounded-md"
              resizeMode="cover"
              accessibilityLabel={title}
            />
          ) : (
            // Books without local cover art (guard title so a bad API item
            // degrades gracefully instead of crashing the list)
            <View className="w-full h-full rounded-md items-center justify-center px-3">
              <Text className="text-base text-gray-800 font-semibold text-center">
                {title ?? ''}
              </Text>
            </View>
          )}
        </View>
        <Text
          className="text-[15px] text-gray-900 font-semibold mt-3"
          numberOfLines={1}
        >
          {title ?? ''}
        </Text>
        {cover?.arabic ? (
          <Text className="text-sm text-gray-500 font-arabic-regular mt-0.5">
            {cover.arabic}
          </Text>
        ) : null}
      </Pressable>
    </Link>
  )
}

function Books() {
  const { isError, data, error, refetch } = useGetBooks()

  // Only take over the screen when there's nothing to show — with cached
  // (placeholder/persisted) data, keep rendering the list.
  const showError = isError && (!data || data.length === 0)

  return (
    <Page edges={['top']} className="bg-royal-blue-950">
      <StatusBar barStyle="light-content" />
      <Header title={t(SHARED_TEXT.BOOKS_HEADER)} ></Header>
      <View className="bg-gray-50 flex-1">
        {showError ? (
          <ErrorState error={error} onRetry={refetch} className="h-full" />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Item title={item.title_ms} id={item.id} slug={item.slug} />
            )}
            keyExtractor={(item) => item.id}
            className="h-full"
            numColumns={2}
            columnWrapperClassName={'px-6 pt-7 justify-between'}
            contentContainerClassName={'pb-10'}
          />
        )}
      </View>
    </Page>
  )
}

export default Books
