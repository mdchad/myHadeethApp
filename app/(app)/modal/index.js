import { View, Text, TextInput, FlatList, Pressable } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import data from '@data/hadeethsV2.json'
import { useDebounce } from "@uidotdev/usehooks";

function Search() {
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedSearchTerm = useDebounce(search, 300);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
  }

  function truncateAndHighlight(text, keyword, bufferLength = 10) {
    const regex = new RegExp(escapeRegExp(keyword), 'gi');
    const parts = [];
    let match;

    let previousEnd = 0;

    while ((match = regex.exec(text)) !== null) {
      // Insert a break if this isn't the first keyword match
      if (previousEnd !== 0) {
        parts.push('\n');
        parts.push('\n');
      }

      // Add the text before the keyword to the parts
      const start = Math.max(0, match.index - bufferLength);
      const prefix = start > 0 && match.index !== 0 ? "..." : "";
      parts.push(prefix + text.substring(start, match.index));

      // Add the keyword (match) to the parts
      parts.push(
        <Text key={match.index} style={{ backgroundColor: 'yellow' }}>
          {match[0]}
        </Text>
      );

      // Add the text immediately after the keyword
      const end = Math.min(text.length, match.index + keyword.length + bufferLength);
      const suffix = end < text.length ? "..." : "";
      parts.push(text.substring(match.index + keyword.length, end) + suffix);

      previousEnd = end;
    }

    return <Text>{parts}</Text>;
  }

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
            <Text className="text-[#433E0E] font-bold">{item?.book_title.ms}, {item.number}</Text>
          </View>
          <Text>{truncateAndHighlight(item?.content?.ms, search, 100)}</Text>
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
