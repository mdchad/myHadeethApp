import {Link, useRouter, useSearchParams} from "expo-router"
import { FlatList, Image, Text, View } from "react-native"
import chapters from '@data/chapters.json'
import {ChevronRight} from "lucide-react-native";
import {TouchableHighlight} from "react-native-gesture-handler";
let he = require('he');

const hadeethCategory = () => {
  let groupedArray = []
  chapters.forEach((item) => {
    let existingCategory = groupedArray.find(
      (category) => category.category_id === item.category_id
    );

    if (existingCategory) {
      existingCategory.chapters.push({
        id: item.id,
        name: item.name,
        title: item.title
      });
    } else {
      groupedArray.push({
        category_id: item.category_id,
        category_name: item.category_name,
        category_title: item.category_title,
        book_id: item.book_id,
        book_name: item.book_name,
        book_title: item.book_title,
        chapters: [{
          id: item.id,
          name: item.name,
          title: item.title,
        }]
      });
    }
  })

  const { title, id } = useSearchParams();
  const router = useRouter();

  function onPressHadith(chapter) {
    return router.push({
      pathname: `/(hadeeth)/content/${chapter.id}`,
      params: {
        chapterTitle: JSON.stringify(chapter.title),
        chapterId: chapter.id,
      }
    })
  }

  return (
    <View className="flex-1 flex space-y-12 bg-white px-6 pt-6">
      <Text className="text-3xl font-bold text-center">{title}</Text>
        <View className="text-center flex space-y-3">
          <FlatList
            data={groupedArray.filter(chapter => chapter.book_id === id)}
            renderItem={({ item, index }) => {
              return(
                  <View className="flex" key={item.category_id}>
                    <View className="">
                      <Text className="my-4 text-gray-800 font-semibold">{item.category_title.ms}</Text>
                    </View>
                    {
                      item.chapters.map(chapter => {
                        return (
                          <TouchableHighlight key={chapter.id} onPress={() => onPressHadith(chapter)} underlayColor="#f9fafb" className="rounded-xl w-full">
                            <View key={chapter.id} className="px-2 py-3 border-t border-t-gray-200">
                              <View className="flex flex-row justify-between items-center w-full">
                                <Text className="basis-2/3">{he.decode(chapter.title.ms)}</Text>
                                <ChevronRight color="black" size={16}/>
                              </View>
                            </View>
                          </TouchableHighlight>
                        )
                      })
                    }
                  </View>
              )
            }}
            keyExtractor={item => item.category_id}
          />
        </View>
    </View>
  )
}

export default hadeethCategory
