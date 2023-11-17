import { FlatList, Pressable, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Page from '@components/page'
import Header from '../../../components/header'
import { Link } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import {useMutation} from "@tanstack/react-query";

function Search() {
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = React.useState(false)
  const res = useMutation({
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
      console.log(data)
      if (data) {
        setFilteredDataSource(data[0].documents)
      }
    }
  })

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special characters for regex
  }

  function highlightKeywords(text, keyword) {
    const regex = new RegExp(escapeRegExp(keyword), 'gi');
    const parts = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add the text before the keyword to the parts
      parts.push(text.substring(0, match.index));

      // Add the keyword (match) to the parts
      parts.push(
        <Text key={match.index} style={{ backgroundColor: 'yellow' }}>
          {match[0]}
        </Text>
      );

      // Update the text to be the part after the keyword
      text = text.substring(match.index + match[0].length);
      regex.lastIndex = 0; // Reset the regex index
    }

    // Add any remaining text after the last match
    parts.push(text);

    return <Text>{parts}</Text>;
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
            hadithId: item.number,
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
            {/*{item.content[0].ms}*/}
            {highlightKeywords(item?.content[0].ms, searchTerm)}
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
      res.mutate(search)
    }
    // } else {
    //   setFilteredDataSource([])
    // }
    // setIsSearching(false)
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
