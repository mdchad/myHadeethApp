import { useSearchParams } from "expo-router"
import { Text, View, ScrollView } from "react-native"
import hadeeths from '@data/hadeeths.json'
let he = require('he');

const hadeethContent = () => {
  const { chapterTitle, chapterId } = useSearchParams();

  return (
    <ScrollView>
      <View className="flex items-center px-6 pt-6">
        {/*<Header user={user.full_name} /> */}
        <Text className="text-center text-2xl mb-2 font-bold" style={{ fontFamily: 'Traditional_Arabic'}}>{chapterTitle ? JSON.parse(chapterTitle).ar : ''}</Text>
        <Text className="text-center text-lg">{chapterTitle ? JSON.parse(chapterTitle).ms : ''}</Text>

        {/* create a next and prev chapter */}
        <View className="my-12">
          {hadeeths?.map(hadeeth => {
            if (hadeeth.chapter_id === chapterId) {
              return (
                <View key={hadeeth.id}>
                  <Text className="mb-4 text-right" selectable={true} style={{ fontFamily: 'ScheherazadeNew_400Regular'}}>{hadeeth.content.ar}</Text>
                  <Text className="mb-4" selectable={true}>{hadeeth.content.ms}</Text>
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
