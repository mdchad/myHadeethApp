import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableHighlight
} from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Page from '@components/page'
import Header from '../../../components/header'
import { Link } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightToLine,
  ChevronRightSquare,
  Clock4,
  SlidersHorizontal,
  XIcon
} from 'lucide-react-native'
import SHARED_TEXT from '../../../i18n'
import { t } from 'i18next'
import Pagination from '../../../components/pagination'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { isArray } from '@freakycoder/react-native-helpers/lib/utils'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView
} from '@gorhom/bottom-sheet'
import {flex} from "nativewind/dist/postcss/to-react-native/properties/flex";

function Search() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = React.useState(1)
  const [searchHistory, setSearchHistory] = useState([])
  const [books, setBooks] = useState([])
  const [selectedBooks, setSelectedBooks] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')

  const queryClient = useQueryClient()

  const { data, fetchStatus } = useQuery({
    queryKey: ['search', page, submittedKeyword, selectedBooks],
    queryFn: async () => {
      const res = await fetch(
        `https://my-way-web.vercel.app/api/search?page=${page}&limit=${10}&query=${encodeURIComponent(
          submittedKeyword
        )}&books=${selectedBooks}`,
        {
          method: 'GET'
        }
      )
      const result = await res.json()
      return result.data
    },
    keepPreviousData: true,
    enabled: !!submittedKeyword // Only run query if search term is not empty
    // If you want to clear the data when the search is disabled, you can use:
    // initialData: queryKeyword ? undefined : [],
  })

  useEffect(() => {
    AsyncStorage.getItem('searchHistory').then((data) => {
      if (data !== null && isArray(data)) {
        const history = JSON.parse(data)
        setSearchHistory(history)
      }
    })
  }, [])

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      // When the search term is cleared, reset the query data
      queryClient.setQueryData(['search', 1, '', ''], [])
      setPage(1)
    }
  }, [searchKeyword, queryClient])

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special characters for regex
  }

  function highlightKeywords(text, keyword) {
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
    parts.push(textWithLanguage)

    if (language === 'ar') {
      return (
        <Text
          style={{ fontFamily: 'arabic_regular' }}
          className="text-2xl text-right"
        >
          {parts}
        </Text>
      )
    }

    return (
      <Text style={{ fontFamily: 'arabic_symbols' }} className="text-md">
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

  function renderedItems({ item }) {
    return (
      <Link
        key={item._id}
        href={{ pathname: `/(search)/hadith/${item._id}` }}
        asChild
      >
        <Pressable key={item._id} className="pb-4 bg-white px-5">
          <View className="my-4 flex flex-row flex-wrap">
            <Text className="font-bold text-royal-blue mr-2">
              {item?.book_title.ms}
            </Text>
            <ChevronRightSquare color="black" size={18} className="mr-2" />
            <Text className="font-bold text-royal-blue mr-2">
              {item.volume_title.ms}
            </Text>
            <ChevronRightSquare color="black" size={18} className="mr-2" />
            <Text className="font-bold text-royal-blue">{item.number}</Text>
          </View>
          <Text>{highlightKeywords(item?.content[0], searchKeyword)}</Text>
          <View className="mt-2 flex items-end">
            <ArrowRightToLine size={22} color={'black'} />
          </View>
        </Pressable>
      </Link>
    )
  }

  async function onSubmit() {
    Keyboard.dismiss()
    let history = []
    if (searchKeyword) {
      setSubmittedKeyword(searchKeyword)
      const filteredArray = searchHistory.filter(
        (item) => item !== searchKeyword
      )
      if (searchHistory.length < 15) {
        history = [searchKeyword, ...filteredArray]
        setSearchHistory(history)
      } else {
        const newArrayWithoutLastItem = filteredArray.slice(
          0,
          filteredArray.length - 1
        )
        history = [searchKeyword, ...newArrayWithoutLastItem]
        setSearchHistory(history)
      }
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history))
    }
  }

  async function onSubmitFromHistory(item) {
    setSearchKeyword(item)
    setSubmittedKeyword(item)
  }

  async function onRemoveFromHistory(item) {
    const removedFromHistory = searchHistory.filter((search) => search !== item)
    setSearchHistory(removedFromHistory)
    await AsyncStorage.setItem(
      'searchHistory',
      JSON.stringify(removedFromHistory)
    )
  }

  const handleChangeText = (newText) => {
    setSearchKeyword(newText)
    setSubmittedKeyword('')
  }

  // console.log("==================")
  // console.log('status', fetchStatus)
  // console.log('data', data)
  // console.log('data', data?.documents)
  const bottomSheetRef = useRef(null)

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], [])

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1)
  }, [])
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} pressBehavior={'close'} opacity={0.5} />
    ),
    []
  )

  function onClickBook(book) {
    if (books.some(val => val === book)) {
      setBooks(prevState => prevState.filter(prev => prev !== book))
    } else {
      setBooks((prevState) => prevState.concat([book]))
    }
  }

  return (
    <Page class="bg-gray-100">
      <Header title={t(SHARED_TEXT.SEARCH_HEADER)} rounded={false} />
      <View
        className={`px-6 flex flex-row justify-between items-end rounded-b-2xl pb-6 shadow-lg bg-royal-blue overflow-hidden`}
      >
        <View className="w-full">
          <View className="bg-white rounded-xl shadow w-full">
            <TextInput
              className="px-4 py-2"
              placeholder={t(SHARED_TEXT.SEARCH_SEARCHBAR_PLACEHOLDER)}
              value={searchKeyword}
              autoFocus={true}
              returnKeyType={'done'}
              onSubmitEditing={onSubmit}
              clearButtonMode={'while-editing'}
              onChangeText={handleChangeText}
            />
          </View>
        </View>
      </View>
      {data && data.totalCount && !!data.totalCount.length && (
        <View className="pl-4 flex flex-row justify-between items-center">
          <Pressable onPress={handlePresentModalPress} className="bg-white rounded-lg p-2">
            <SlidersHorizontal size={24} color={'black'}/>
          </Pressable>
          <Pagination
            count={data?.totalCount[0]?.count}
            term={searchKeyword}
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
          return fetchStatus === 'idle' &&
            searchKeyword &&
            !!submittedKeyword ? (
            <View className="flex-1 flex items-center justify-center">
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
                        className="flex-1 space-x-2 flex flex-row items-center py-2"
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
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ padding: 10, height: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <View className="flex flex-row gap-2 flex-wrap">
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sahih_bukhari') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sahih_bukhari')}
            >
              <Text>Sahih Bukhari</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sahih_muslim') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sahih_muslim')}
            >
              <Text>Sahih Muslim</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sunan_abi_daud') && 'bg-gray-200'} rounded-lg px-4 py-2 border border-gray-200`}
              onPress={() => onClickBook('sunan_abi_daud')}
            >
              <Text>Sunan Abu Dawud</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'jami_al_tirmidhi') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('jami_al_tirmidhi')}
            >
              <Text>Jami’ Al-Tirmidhi</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sunan_ibnu_majah') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sunan_ibnu_majah')}
            >
              <Text>Sunan Ibn Majah</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#f9fafb"
              className={`${books.some(val => val === 'sunan_an_nasai') && 'bg-gray-200'} rounded-lg px-4 py-2  border border-gray-200`}
              onPress={() => onClickBook('sunan_an_nasai')}
            >
              <Text>Sunan Al-Nasai</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight underlayColor="#333" className="bg-royal-blue mb-4 rounded-3xl p-2" onPress={() => setSelectedBooks(books.join(','))}>
            <Text className="text-white text-lg text-center">{t(SHARED_TEXT.SEARCH_APPLY)} ({(books.length)})</Text>
          </TouchableHighlight>
        </BottomSheetView>
      </BottomSheet>
    </Page>
  )
}

export default Search
