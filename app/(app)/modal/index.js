import { View, Text, StyleSheet, TextInput, FlatList, TouchableWithoutFeedback, Keyboard, ScrollView, VirtualizedList, Button, KeyboardAvoidingView, Pressable, SectionList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import data from '@data/hadeethsV2.json'
import { useDebounce } from "@uidotdev/usehooks";

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

const Search = () => {
  const router = useRouter();
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedSearchTerm = useDebounce(search, 300);

  const highlightText = (text, query) => {
    if (!query.trim()) {
      return text;
    }

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return (
      <Text>

        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} style={{ backgroundColor: 'yellow' }}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  useEffect(() => {
    if (search) {
        // Inserted text is not blank
        // Filter the masterDataSource and update FilteredDataSource
      const newData = data.filter((item) => {
        // Applying filter for the inserted text in search bar
        const itemData = item.content.ms
          ? item.content.ms.toLowerCase()
          : '';
        const textData = search.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setIsSearching(false);
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource([])
    }

  }, [debouncedSearchTerm]);

  const searchFilterFunction = (text) => {
    setIsSearching(true);
    setSearch(text)
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  function renderedItems({ item }) {
    return (
      <Link href={{
        pathname: `/(hadeeth)/content/${item.volume_id}`,
        params: {
          hadeethId: item.id,
          volumeId: item.volume_id,
          bookId: item.book_id,
        }
      }}>
        <View key={item.id} className="pb-4">
          <View className="my-4">
            <Text className="text-[#433E0E] font-bold">{item?.book_title.ms}</Text>
          </View>
          <Text>{highlightText(item?.content?.ms, search)}</Text>
        </View>
      </Link>
    )
  }

  return (
    <SafeAreaView className="flex-1 flex gap-5 bg-white">
      <View className="flex flex-row gap-3 items-center px-3">
        <View className="flex-1 relative flex items-center justify-center">
          <View className="bg-white flex-1 rounded-lg shadow w-full">
            <TextInput
              className="flex-1 px-3"
              placeholder="Search..."
              value={search}
              autoFocus={true}
              onChangeText={(text) => searchFilterFunction(text)}
            />
          </View>
          {search.length > 0 && (
            <View className="absolute right-0 top-0 bottom-0 flex justify-center pr-2">
              <Pressable onPress={() => { setSearch('') }}>
                <MaterialIcons name="cancel" size={20} color="black" />
              </Pressable>
            </View>
          )}
        </View>
        <Link href="../" className="p-2 text-lg">
          Cancel
        </Link>
      </View>
      {/* {value.length > 0 && ( */}

      <FlatList
        className="px-5"
        data={filteredDataSource}
        renderItem={renderedItems}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        ItemSeparatorComponent={ItemSeparatorView}
        ListEmptyComponent={() => {
          return !isSearching && search.length ? (
              <View className="flex-1 flex items-center justify-center">
                <Text className="text-lg">No results found.</Text>
                <Text className="text-sm"> Try something else instead?</Text>
              </View>
            )
            : (
              <View></View>
            )
        }}
      />

      {/* )} */}
    </SafeAreaView>
  )
}

export default Search
