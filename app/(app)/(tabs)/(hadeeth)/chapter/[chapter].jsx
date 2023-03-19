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
    <ScrollView>
      <View className="flex items-center bg-white px-6 pt-6">
        <Text className="text-3xl font-bold text-center">{categoryTitle}</Text>
        {/*<Text className="text-lg font-bold">Chapter: {chapter}</Text>*/}
        {/*<Text className="text-md mb-2">{parseData?.title?.ar}</Text>*/}
        {/*<Text className="text-md">{parseData?.title?.ms}</Text>*/}

        {/* create a next and prev chapter */}
        <View className="text-center flex space-y-3">
          <FlatList
            horizontal={true}
            data={chapters.filter(chapter => chapter.category_id === categoryId)}
            renderItem={({ item, index }) => (
              <Link href={{
                pathname: `/(hadeeth)/content/${item.id}`,
                params: {
                  chapterTitle: JSON.stringify(item?.title),
                  chapterId: item?.id,
                }
              }}>
                <View className="w-20 space-x-3 flex items-center">
                  <View className="rounded-2xl border border-[#433E0E] flex items-center justify-center mt-4 w-16 h-16">
                    <Image
                      source={arabicNumeric[index]}
                      style={{ width: 30, height: 50 }}
                    />
                  </View>
                  <Text className="text-center mt-1 uppercase text-xs">{item.title.ms}</Text>
                </View>
              </Link>
            )}
            keyExtractor={item => item.id}
          />
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