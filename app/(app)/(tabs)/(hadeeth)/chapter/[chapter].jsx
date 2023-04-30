import {Link, useRouter, useSearchParams} from "expo-router"
import {FlatList, Image, Pressable, ScrollView, Text, View} from "react-native"
import chapters from '@data/chapters.json'

const arabicNumeric = [
  "",
  require("@assets/one.png"),
  require("@assets/two.png"),
  require("@assets/three.png"),
  require("@assets/four.png")
]

const hadeethChapter = () => {
  const { categoryId, categoryTitle } = useSearchParams();
  const router = useRouter();

  let index = 0

  return (
      <View className="flex-1 flex space-y-3 bg-white px-6 pt-6">
        <Text className="mb-6 text-3xl font-bold text-center">{categoryTitle}</Text>
        {/*<Text className="text-lg font-bold">Chapter: {chapter}</Text>*/}
        {/*<Text className="text-md mb-2">{parseData?.title?.ar}</Text>*/}
        {/*<Text className="text-md">{parseData?.title?.ms}</Text>*/}

        {chapters.map((chapter) => {
          if (chapter.category_id === categoryId) {
            index++
            return (
              <View key={chapter.id}>
                <Pressable onPress={() => router.push({
                  pathname: `/(hadeeth)/content/${chapter.id}`,
                  params: {
                    chapterTitle: JSON.stringify(chapter.title),
                    chapterId: chapter.id,
                  }
                })} >
                  <View className="flex flex-row items-center mb-4">
                    <View className="rounded-2xl border border-[#433E0E] flex items-center justify-center w-16 h-16">
                      <Image
                        source={arabicNumeric[index]}
                        style={{ width: 30, height: 50 }}
                      />
                    </View>
                    <Text className="w-48 uppercase ml-4 mt-2 text-xs">{chapter.title.ms}</Text>
                  </View>
                </Pressable>
              </View>
            )
          }
        })
        }
        {/*<Link href={`Content/Hadeeth/chapter/${parseInt(chapter) + 1}`}>*/}
        {/*  <Text>Next Chapter</Text>*/}
        {/*</Link>*/}

        {/*<Link href={`Content/Hadeeth/chapter/${parseInt(chapter) - 1}`}>*/}
        {/*  <Text>Prev Chapter</Text>*/}
        {/*</Link>*/}

      </View>
  )
}

export default hadeethChapter