import { Link, useSearchParams } from "expo-router"
import { FlatList, Image, Text, View, ScrollView } from "react-native"
import hadeeths from '@data/hadeeths.json'

const arabicNumeric = [
  require("@assets/one.png"),
  require("@assets/two.png"),
  require("@assets/three.png"),
  require("@assets/four.png")
]

const hadeethContent = () => {
    const { chapterTitle, chapterId } = useSearchParams();

    return (
      <ScrollView>
        <View className="flex items-center px-6 pt-6">
           {/*<Header user={user.full_name} /> */}
          <Text className="text-center text-lg mb-2">{JSON.parse(chapterTitle).ar}</Text>
          <Text className="text-center text-lg">{JSON.parse(chapterTitle).ms}</Text>

          {/* create a next and prev chapter */}
          <View className="my-8">
            {hadeeths?.map(hadeeth => {
              if (hadeeth.chapter_id === chapterId) {
                return (
                  <View key={hadeeth.id}>
                    <Text className="mb-4">{hadeeth.content.ar}</Text>
                    <Text className="mb-4">{hadeeth.content.ms}</Text>
                  </View>
                )
              }
            })}
          </View>
        </View>
      </ScrollView>
    )
}

export default hadeethContent
