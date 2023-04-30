import { View, Text, StyleSheet, TextInput, FlatList, TouchableWithoutFeedback, Keyboard, ScrollView, VirtualizedList, Button, KeyboardAvoidingView, Pressable, SectionList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import datas from '@data/hadeeths.json'

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
  const [index, setIndex] = useState(null);

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

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = datas.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.content.ms
          ? item.content.ms.toLowerCase()
          : '';
        const textData = text.toLowerCase();
        setIndex(itemData.indexOf(textData))
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource([]);
      setSearch(text);
    }
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
        pathname: `/(hadeeth)/content/${item.chapter_id}`,
        params: {
          chapterTitle: JSON.stringify(item?.title),
          chapterId: item?.chapter_id
        }
      }}>
        <View key={item.id} className="pb-4">
          <View className="my-4">
            <Text className="text-[#433E0E] font-bold">{item?.book_title}</Text>
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
              onChangeText={(text) => searchFilterFunction(text)}
            />
          </View>
          {search.length > 0 && (
            <View className="absolute right-0 top-0 bottom-0 flex justify-center pr-2">
              <Pressable onPress={() => { setSearch('') }}>
                <MaterialIcons name="cancel" size={16} color="black" />
              </Pressable>
            </View>
          )}
        </View>
        <Link href="../" className="p-2">
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
          return search.length ? (
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

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: '100%',
    // backgroundColor: 'red',
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  countryDescription: {
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
});



