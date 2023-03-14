import { Link, useSearchParams } from "expo-router"
import { FlatList, SectionList, Text, View } from "react-native"
import data from '@data/hadeeth.json'
import { useEffect } from "react";

const hadeethContent = () => {
  const { chapter, data, category } = useSearchParams();
  const parsedData = data ? JSON.parse(data) : {}

  return (
    <View className="flex items-center px-6">
      <Text className="text-3xl font-bold">{category}</Text>
      <Text className="text-lg font-bold">Chapter: {chapter}</Text>
      <Text className="text-md mb-2">{parsedData?.title.ar}</Text>
      <Text className="text-md">{parsedData?.title.ms}</Text>

      {/* create a next and prev chapter */}
      <View className="my-8">
        <FlatList
          data={parsedData?.hadeeth}
          renderItem={({ item }) => (
            <>
              <Text className="mb-4">{item.content.ar}</Text>
              <Text>{item.content.ms}</Text>
            </>
          )}
          keyExtractor={item => item.id}
        />
      </View>
      <Link href={`Content/Hadeeth/chapter/${parseInt(chapter) + 1}`}>
        <Text>Next Chapter</Text>
      </Link>

      <Link href={`Content/Hadeeth/chapter/${parseInt(chapter) - 1}`}>
        <Text>Prev Chapter</Text>
      </Link>

      <Link href="../">Back</Link>
    </View>
  )
}

export default hadeethContent