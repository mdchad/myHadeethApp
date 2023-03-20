import { Link, useSearchParams } from "expo-router"
import {FlatList, Image, ScrollView, Text, View} from "react-native"
import chapters from '@data/chapters.json'

const arabicNumeric = [
  require("@assets/one.png"),
  require("@assets/two.png"),
  require("@assets/three.png"),
  require("@assets/four.png")
]

const hadeethChapter = () => {
  const { categoryId, categoryTitle } = useSearchParams();

  return (
    <ScrollView className="bg-white">
      <View className="flex bg-white px-6 pt-6">
        <Text className="mb-6 text-3xl font-bold text-center">{categoryTitle}</Text>
        {/*<Text className="text-lg font-bold">Chapter: {chapter}</Text>*/}
        {/*<Text className="text-md mb-2">{parseData?.title?.ar}</Text>*/}
        {/*<Text className="text-md">{parseData?.title?.ms}</Text>*/}

        {/* create a next and prev chapter */}
        <View className="flex space-y-3">
          {chapters.map((chapter, i) => {
            const index = 0
            if (chapter.category_id === categoryId) {
              return (
                <Link
                  key={i}
                  href={{
                    pathname: `/(hadeeth)/content/${chapter.id}`,
                    params: {
                      chapterTitle: JSON.stringify(chapter.title),
                      chapterId: chapter.id,
                    }
                }}>
                  <View className="flex flex-row items-center block mb-4">
                    <View className="rounded-2xl border border-[#433E0E] flex items-center justify-center mt-4 w-16 h-16">
                      <Image
                        source={arabicNumeric[i]}
                        style={{ width: 30, height: 50 }}
                      />
                    </View>
                    <Text className="w-48 uppercase ml-4 mt-2 text-xs">{chapter.title.ms}</Text>
                  </View>
                </Link>
              )
            }
            return null
            })
          }
        </View>
        {/*<Link href={`Content/Hadeeth/chapter/${parseInt(chapter) + 1}`}>*/}
        {/*  <Text>Next Chapter</Text>*/}
        {/*</Link>*/}

        {/*<Link href={`Content/Hadeeth/chapter/${parseInt(chapter) - 1}`}>*/}
        {/*  <Text>Prev Chapter</Text>*/}
        {/*</Link>*/}

       </View>
    </ScrollView>
  )
}

export default hadeethChapter