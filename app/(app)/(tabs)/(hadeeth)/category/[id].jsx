import { Link, useRouter, useSearchParams } from "expo-router"
import { FlatList, ScrollView, Text, View } from "react-native"
import chapters from '@data/chapters.json'
import { ChevronRight } from "lucide-react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Item from "../../../../components/accordion";
import Accordion from "../../../../components/accordion";
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 space-y-6 flex bg-gray-100 px-6 pt-6">
            <Text className="text-3xl font-bold text-center">{title}</Text>
            <View className="text-center flex">
                {groupedArray.map((item, key) => {
                    if (item.book_id === id) {
                        return (
                          <Accordion key={key} title={item.category_title.ms}>
                              {item.chapters.map(chapter => {
                                      return (
                                        <TouchableHighlight key={chapter.id} onPress={() => onPressHadith(chapter)} underlayColor="#f9fafb" className="rounded-xl w-full">
                                            <View key={chapter.id} className="px-4 py-4">
                                                <View className="flex flex-row justify-between items-center w-full">
                                                    <Text className="w-[90%]">{he.decode(chapter.title.ms)}</Text>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                      )
                                  })
                              }
                          </Accordion>
                        )
                    }
                })}
            </View>
            {/*    <FlatList*/}
            {/*        className="h-full"*/}
            {/*        data={groupedArray.filter(chapter => chapter.book_id === id)}*/}
            {/*        renderItem={({ item, index }) => {*/}
            {/*            return (*/}
            {/*              <Item index={index} title={item.category_title.ms}>*/}
            {/*                  {*/}
            {/*                      item.chapters.map(chapter => {*/}
            {/*                          return (*/}
            {/*                            <TouchableHighlight key={chapter.id} onPress={() => onPressHadith(chapter)} underlayColor="#f9fafb" className="rounded-xl w-full">*/}
            {/*                                <View key={chapter.id} className="px-4 py-4 border-t border-t-gray-200">*/}
            {/*                                    <View className="flex flex-row justify-between items-center w-full">*/}
            {/*                                        <Text className="w-[90%]">{he.decode(chapter.title.ms)}</Text>*/}
            {/*                                        <ChevronRight color="black" size={16} />*/}
            {/*                                    </View>*/}
            {/*                                </View>*/}
            {/*                            </TouchableHighlight>*/}
            {/*                          )*/}
            {/*                      })*/}
            {/*                  }*/}
            {/*              </Item>*/}
            {/*                // <View className="flex" key={item.category_id}>*/}
            {/*                //     <View className="">*/}
            {/*                //         <Text className="my-4 text-gray-800 font-semibold">{item.category_title.ms}</Text>*/}
            {/*                //     </View>*/}

            {/*                // </View>*/}
            {/*            )*/}
            {/*        }}*/}
            {/*        keyExtractor={item => item.category_id}*/}
            {/*    />*/}
            {/*</View>*/}
        </View>
      </ScrollView>
    )
}

export default hadeethCategory
