import { FlatList, Pressable, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Page from '@components/page'
import Header from '../../../components/header'
import { Link } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

const Search = () => {
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = React.useState(false)

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special characters for regex
  }

  function truncateAndHighlight(text, keyword, bufferLength = 10) {
    const regex = new RegExp(escapeRegExp(keyword), 'gi')
    const parts = []
    let match

    let previousEnd = 0

    while ((match = regex.exec(text)) !== null) {
      // Insert a break if this isn't the first keyword match
      if (previousEnd !== 0) {
        parts.push('\n')
        parts.push('\n')
      }

      // Add the text before the keyword to the parts
      const start = Math.max(0, match.index - bufferLength)
      const prefix = start > 0 && match.index !== 0 ? '...' : ''
      parts.push(prefix + text.substring(start, match.index))

      // Add the keyword (match) to the parts
      parts.push(
        <Text key={match.index} style={{ backgroundColor: 'yellow' }}>
          {match[0]}
        </Text>
      )

      // Add the text immediately after the keyword
      const end = Math.min(
        text.length,
        match.index + keyword.length + bufferLength
      )
      const suffix = end < text.length ? '...' : ''
      parts.push(text.substring(match.index + keyword.length, end) + suffix)

      previousEnd = end
    }

    return <Text>{parts}</Text>
  }

  const searchFilterFunction = (text) => {
    setIsSearching(true)
    setSearch(text)
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
      <Link
        href={{
          pathname: `/(hadeeth)/content/${item.volume_id}`,
          params: {
            hadeethId: item.id,
            volumeId: item.volume_id,
            bookId: item.book_id
          }
        }}
      >
        <View key={item.id} className="pb-4">
          <View className="my-4">
            <Text className="text-[#433E0E] font-bold">
              {item?.book_title.ms}, {item.number}
            </Text>
          </View>
          <Text>
            {truncateAndHighlight(item?.content?.ms, searchTerm, 100)}
          </Text>
        </View>
      </Link>
    )
  }

  function removeSearch() {
    setSearch('')
    setSearchTerm('')
    setFilteredDataSource([])
  }

  function onSubmit() {
    setSearchTerm(search)
    if (search) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      // const newData = data.filter((item) => {
      //   // Applying filter for the inserted text in search bar
      //   const itemData = item.content.ms ? item.content.ms.toLowerCase() : ''
      //   const textData = search.toLowerCase()
      //   return itemData.indexOf(textData) > -1
      // })
      // setFilteredDataSource(newData)
    } else {
      setFilteredDataSource([])
    }
    setIsSearching(false)
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
              value={search}
              autoFocus={true}
              returnKeyType={'done'}
              onSubmitEditing={onSubmit}
              onChangeText={(text) => searchFilterFunction(text)}
            />
          </View>
          {search.length > 0 && (
            <View className="absolute right-0 top-0 bottom-0 flex justify-center pr-2">
              <Pressable onPress={removeSearch}>
                <MaterialIcons name="cancel" size={20} color="black" />
              </Pressable>
            </View>
          )}
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
          return !isSearching && searchTerm.length ? (
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
