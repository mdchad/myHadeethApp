import { Link, useSearchParams } from "expo-router"
import { FlatList, Image, Text, View } from "react-native"
import categories from '@data/categories.json'
import {useEffect, useState} from "react";

const arabicNumeric = [
  require("@assets/one.png"),
  require("@assets/two.png"),
  require("@assets/three.png"),
  require("@assets/four.png")
]

const hadeethCategory = () => {
  const { title, id } = useSearchParams();

  return (
    <View className="flex-1 flex space-y-3 bg-white px-4">
      {/* <Header user={user.full_name} /> */}
      <View className="flex justify-center items-center p-3">
        <Text className="text-lg text-center">{title}</Text>
        {/*<Link href="../">Back</Link>*/}
      </View>

      <View className="text-center flex space-y-3">
        <FlatList
          horizontal={true}
          data={categories.filter(category => category.book_id === id)}
          renderItem={({ item, index }) => (
            <Link href={{
              pathname: `/(hadeeth)/chapter/${item.id}`,
              params: {
                categoryTitle: item?.title.ms,
                categoryId: item?.id
              }
            }}>
              <View className="space-x-3 flex items-center">
                <View className="rounded-2xl border border-[#433E0E] flex items-center justify-center mt-4 w-16 h-16">
                  <Image
                    source={arabicNumeric[index]}
                    style={{ width: 30, height: 50 }}
                  />
                </View>
                <Text className="text-center w-11/12 mt-1 uppercase text-xs">Book {item.title.ms}</Text>
              </View>
            </Link>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

export default hadeethCategory
