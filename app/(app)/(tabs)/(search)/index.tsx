import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableHighlight,
  StatusBar
} from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Page from '@/app/components/page'
import Header from '@/app/components/header'
import { Link } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightToLine,
  ChevronRightSquare,
  Clock4,
  SlidersHorizontal,
  XIcon,
  Search as SearchIcon
} from 'lucide-react-native'
import SHARED_TEXT from '@/app/i18n'
import { t } from 'i18next'
import Pagination from '@/app/components/pagination'
import BottomSheet from '@gorhom/bottom-sheet'
import QuranText from '@/app/components/quran-text'
import Sheet from '@/app/components/bottomSheet'
import { usePostHog } from 'posthog-react-native'
import LoadingSpinner from '@/app/components/loading-spinner'
import { useSearchHistoryStore } from '@/app/stores/useSearchHistoryStore'
import { apiGet } from '@/app/utils/api'

interface BilingualText {
  ms: string
  ar: string
}

interface SearchResultItem {
  _id: string
  book_title: BilingualText
  volume_title: BilingualText
  number: number
  content: BilingualText[]
}

interface RenderedItemsProps {
  item: SearchResultItem
}

function Search() {
  const posthog = usePostHog()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = React.useState(1)
  const [books, setBooks] = useState<string[]>([])
  const [selectedBooks, setSelectedBooks] = useState<string>('')
  const [submittedKeyword, setSubmittedKeyword] = useState<string>('')
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Use Zustand store for search history
  const { history: searchHistory, addToHistory, removeFromHistory } = useSearchHistoryStore()

  const queryClient = useQueryClient()

  const { data, fetchStatus, isLoading } = useQuery({
    queryKey: ['search', page, submittedKeyword, selectedBooks],
    queryFn: async () => {
      const result = await apiGet(
        `/api/search?page=${page}&limit=10&query=${encodeURIComponent(
          submittedKeyword
        )}&books=${selectedBooks}`
      )
      return result.data
    },
    keepPreviousData: true,
    enabled: !!submittedKeyword // Only run query if search term is not empty
    // If you want to clear the data when the search is disabled, you can use:
    // initialData: queryKeyword ? undefined : [],
  })

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      // When the search term is cleared, reset the query data
      queryClient.setQueryData(['search', 1, '', ''], [])
      setPage(1)
    }
  }, [searchKeyword, queryClient])

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special characters for regex
  }

  function highlightKeywords(text: BilingualText, keyword: string) {
    const arabicRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669]/
    const latinRegex = /[A-Za-z\d]/

    let language = ''
    if (arabicRegex.test(keyword)) {
      language = 'ar'
    } else if (latinRegex.test(keyword)) {
      language = 'ms'
    }

    let textWithLanguage = text[language]

    // Define Arabic diacritics characters
    const diacritics = '\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED'

    // Escape RegExp special characters in keyword and allow for diacritics after each character
    const regexPattern = keyword
      .split('')
      .map((char) => {
        return escapeRegExp(char) + '[' + diacritics + ']*'
      })
      .join('')

    const regex = new RegExp(regexPattern, 'gi')

    const parts = []
    let match

    if (keyword) {
      while ((match = regex.exec(textWithLanguage)) !== null) {
        // Add the text before the keyword
        parts.push(textWithLanguage.substring(0, match.index))

        // Add the highlighted keyword
        parts.push(
          <Text key={Math.random()} style={{ backgroundColor: 'yellow' }}>
            {match[0]}
          </Text>
        )

        // Update the text to be the part after the keyword
        textWithLanguage = textWithLanguage.substring(
          match.index + match[0].length
        )
        regex.lastIndex = 0
      }
    }

    // Add any remaining text after the last match
    if (language === 'ar') {
      textWithLanguage = (
        <QuranText
          key={Math.random()}
          text={textWithLanguage}
          font={'arabic-regular'}
        />
      )
    } else {
      textWithLanguage = (
        <QuranText
          key={Math.random()}
          text={textWithLanguage}
          font={'arabic-symbols'}
          special={true}
        />
      )
    }
    parts.push(textWithLanguage)

    if (language === 'ar') {
      return (
        <Text className="text-xl text-right font-arabic-regular">{parts}</Text>
      )
    }

    return (
      <Text
        className="text-md font-arabic-symbols"
        style={{ writingDirection: 'ltr' }}
      >
        {parts}
      </Text>
    )
  }

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        key={Math.random()}
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8'
        }}
      />
    )
  }

  function renderedItems({ item }: RenderedItemsProps) {
    return (
      <Link
        key={item._id}
        href={{
          pathname: '/(app)/hadith-detail/[id]',
          params: { id: item._id }
        }}
        asChild
      >
        <Pressable key={item._id} className="pb-4 bg-white px-5">
          <View className="my-4 flex flex-row flex-wrap">
            <Text className="font-geist-mono-medium mr-2 text-orange-accent capitalize">
              [ {item?.book_title.ms} / {item.volume_title.ms} ]
            </Text>
          </View>
          <Text>{highlightKeywords(item?.content[0], searchKeyword)}</Text>
          <View className="mt-2 flex items-end">
            <ArrowRightToLine size={22} color={'black'} />
          </View>
        </Pressable>
      </Link>
    )
  }

  function onSubmit() {
    Keyboard.dismiss()
    if (searchKeyword) {
      setSubmittedKeyword(searchKeyword)

      // Capture search event
      posthog.capture('hadith_searched', {
        query: searchKeyword,
        books_filtered: selectedBooks || 'all'
      })

      // Add to history using Zustand store
      addToHistory(searchKeyword)
    }
  }

  function onSubmitFromHistory(item: string) {
    setSearchKeyword(item)
    setSubmittedKeyword(item)
  }

  function onRemoveFromHistory(item: string) {
    removeFromHistory(item)
  }

  const handleChangeText = (newText: string) => {
    setSearchKeyword(newText)
    setSubmittedKeyword('')
  }

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1)
  }, [])

  return (
    <Page edges={['top']} className="bg-royal-blue-950">
      <StatusBar barStyle="light-content" />
      {/*<Header title={t(SHARED_TEXT.SEARCH_HEADER)} rounded={false} />*/}
      <View className="flex-1 bg-gray-100">
        <View
          className={`px-4 flex flex-row justify-between items-center rounded-b-2xl pb-6 pt-6 shadow-lg bg-royal-blue-950 overflow-hidden`}
        >
          <View className="flex-1 bg-white rounded-full shadow-md flex-row items-end px-4 py-3">
            <SearchIcon size={20} className="h-[4lh]" color="#666" />
            <TextInput
              className="flex-1 leading-5 text-base ml-2"
              placeholder={t(SHARED_TEXT.SEARCH_SEARCHBAR_PLACEHOLDER)}
              value={searchKeyword}
              autoCorrect={false}
              autoComplete={'off'}
              spellCheck={false}
              returnKeyType={'search'}
              onSubmitEditing={onSubmit}
              clearButtonMode={'while-editing'}
              onChangeText={handleChangeText}
            />
          </View>
          <TouchableOpacity
            onPress={handlePresentModalPress}
            className="ml-3 bg-white rounded-full p-3 shadow-md relative"
          >
            <SlidersHorizontal size={20} color="#1e3a8a" />
            {!!books.length && (
              <View className="absolute -top-1 -right-1 rounded-full w-5 h-5 bg-red-500 flex items-center justify-center">
                <Text className="text-xs font-bold text-white">
                  {books.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {data && data.totalCount && !!data.totalCount.length && (
          <View className="pl-4 pr-4 flex flex-row justify-end items-center">
            <Pagination
              count={data?.totalCount[0]?.count}
              currentPage={page}
              setPage={setPage}
            />
          </View>
        )}
        <FlatList
          data={data?.documents}
          renderItem={renderedItems}
          keyExtractor={(item) => item?._id}
          scrollEnabled={true}
          ItemSeparatorComponent={ItemSeparatorView}
          ListEmptyComponent={() => {
            return isLoading || fetchStatus === 'fetching' ? (
              <View className="flex-1 h-svh flex items-center justify-center">
                <LoadingSpinner />
              </View>
            ) : fetchStatus === 'idle' &&
              searchKeyword &&
              !!submittedKeyword ? (
              <View className="flex-1 h-svh flex items-center justify-center">
                <Text className="text-lg">
                  {t(SHARED_TEXT.SEARCH_NO_RESULT_LABEL)}
                </Text>
                <Text className="text-sm">
                  {t(SHARED_TEXT.SEARCH_NO_RESULT_DESC)}
                </Text>
              </View>
            ) : fetchStatus === 'idle' && searchKeyword === '' ? (
              <View className="px-5 my-2 w-full flex flex-1">
                {!!searchHistory.length &&
                  searchHistory.map((item, i) => {
                    return (
                      <View key={i} className="flex flex-row items-center">
                        <TouchableOpacity
                          className="flex-1 gap-2 flex flex-row items-center py-2"
                          onPress={() => onSubmitFromHistory(item)}
                        >
                          <Clock4 size={16} color={'grey'} />
                          <Text className="text-lg">{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="py-2"
                          onPress={() => onRemoveFromHistory(item)}
                        >
                          <XIcon size={18} color={'grey'} />
                        </TouchableOpacity>
                      </View>
                    )
                  })}
              </View>
            ) : (
              <View></View>
            )
          }}
        />
      </View>
      <Sheet
        setSelectedBooks={setSelectedBooks}
        setBooks={setBooks}
        books={books}
        bottomSheetRef={bottomSheetRef}
      />
    </Page>
  )
}

export default Search
