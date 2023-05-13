import { useSearchParams } from "expo-router"
import { Text, View, ScrollView } from "react-native"
import hadeeths from '@data/hadeeths.json'
import {TextInput} from "react-native";
let he = require('he');

const hadeethContent = () => {
  const { chapterTitle, chapterId } = useSearchParams();

  return (
    <ScrollView>
      <View className="flex items-center px-6 pt-6">
        {/*<Header user={user.full_name} /> */}
        <Text className="text-center text-3xl mb-2 font-semibold" style={{ fontFamily: 'Traditional_ArabicBold'}}>{chapterTitle ? JSON.parse(chapterTitle).ar : ''}</Text>
        <Text className="text-center text-lg font-semibold">{chapterTitle ? JSON.parse(chapterTitle).ms : ''}</Text>

        {/* create a next and prev chapter */}
        <View className="my-12">
          {hadeeths?.map(hadeeth => {
            if (hadeeth.chapter_id === chapterId) {
              return (
                <View key={hadeeth.id}>
                  {/*<Text className="mb-4 text-right text-2xl" selectable={true} style={{ fontFamily: 'Traditional_ArabicRegular'}}>{hadeeth.content.ar}</Text>*/}
                  <TextInput className="mb-4 text-right text-2xl" style={{ fontFamily: 'Traditional_ArabicRegular'}} scrollEnabled={false} readOnly multiline value={hadeeth.content.ar} />
                  <TextInput className="mb-16 text-md overflow-hidden" scrollEnabled={false} readOnly multiline value={hadeeth.content.ms} />
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
