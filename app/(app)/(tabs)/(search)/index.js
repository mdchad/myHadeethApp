import { FlatList, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Page from '@components/page'
import Header from '../../../components/header'
import { Link } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { ChevronRightSquare } from 'lucide-react-native'

function Search() {
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const { status, mutate } = useMutation({
    mutationFn: async (query, page = 1, limit = 10) => {
      const res = await fetch(
        `https://my-way-web.vercel.app/api/search?page=${page}&limit=${limit}&query=${query}`,
        {
          method: 'GET'
        }
      )
      const result = await res.json()
      return result.data
    },
    onSuccess: (data) => {
      if (data) {
        setFilteredDataSource(data[0].documents)
      }
    }
  })

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special characters for regex
  }

  function highlightKeywords(text, keyword) {
    const arabicRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
    // Regex for detecting Latin script (common in Malay)
    const latinRegex = /[A-Za-z]/

    // Determine the language of the keyword
    let language = ''
    if (arabicRegex.test(keyword)) {
      language = 'ar'
    } else if (latinRegex.test(keyword)) {
      language = 'ms'
    }

    let textWithLanguage = text[language]

    const regex = new RegExp(escapeRegExp(keyword), 'gi')
    const parts = []
    let match

    while ((match = regex.exec(textWithLanguage)) !== null) {
      // Add the text before the keyword to the parts
      parts.push(textWithLanguage.substring(0, match.index))

      // Add the keyword (match) to the parts
      parts.push(
        <Text key={match.index} style={{ backgroundColor: 'yellow' }}>
          {match[0]}
        </Text>
      )

      // Update the text to be the part after the keyword
      textWithLanguage = textWithLanguage.substring(
        match.index + match[0].length
      )
      regex.lastIndex = 0 // Reset the regex index
    }

    // Add any remaining text after the last match
    parts.push(textWithLanguage)

    if (language === 'ar') {
      return (
        <Text
          style={{ fontFamily: 'Traditional_ArabicRegular' }}
          className="text-2xl text-right"
        >
          {parts}
        </Text>
      )
    }

    return (
      <Text style={{ fontFamily: 'KFGQPC_Regular' }} className="text-md">
        {parts}
      </Text>
    )
  }

  const searchFilterFunction = (text) => {
    setSearchKeyword(text)
  }

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
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
      <Link href={{ pathname: `/(search)/hadith/${item._id}` }}>
        <View key={item._id} className="pb-4">
          <View className="my-4 flex flex-row flex-wrap space-x-2">
            <Text className="font-bold text-royal-blue">
              {item?.book_title.ms}
            </Text>
            <ChevronRightSquare color="black" size={18} />
            <Text className="font-bold text-royal-blue">
              {item.volume_title.ms}
            </Text>
            <ChevronRightSquare color="black" size={18} />
            <Text className="font-bold text-royal-blue">{item.number}</Text>
          </View>
          <Text>{highlightKeywords(item?.content[0], submittedKeyword)}</Text>
        </View>
      </Link>
    )
  }

  function onSubmit() {
    setSubmittedKeyword(searchKeyword)
    if (searchKeyword) {
      mutate(searchKeyword)
    } else {
      setFilteredDataSource([])
    }
  }

  return (
    <Page class="bg-gray-100">
      <Header title={'Search'} rounded={false} />
      <View
        className={`px-6 lex flex-row justify-between items-end rounded-b-2xl pb-6 shadow-lg bg-royal-blue overflow-hidden`}
      >
        <View className="w-full">
          <View className="bg-white rounded-2xl shadow w-full">
            <TextInput
              className="px-4 py-2"
              placeholder="Search for Hadith, Books, Etc"
              value={searchKeyword}
              autoFocus={true}
              returnKeyType={'done'}
              onSubmitEditing={onSubmit}
              clearButtonMode={'while-editing'}
              onChangeText={(text) => searchFilterFunction(text)}
            />
          </View>
        </View>
      </View>
      <FlatList
        className="px-5"
        data={filteredDataSource}
        renderItem={renderedItems}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        ItemSeparatorComponent={ItemSeparatorView}
        ListEmptyComponent={() => {
          return status === 'success' && submittedKeyword ? (
            <View className="flex-1 flex items-center justify-center">
              <Text className="text-lg">No results found.</Text>
              <Text className="text-sm"> Try something else instead?</Text>
            </View>
          ) : (
            <View></View>
          )
        }}
      />
    </Page>
  )
}

export default Search
