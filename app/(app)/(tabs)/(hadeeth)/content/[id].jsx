import { Link, useSearchParams } from "expo-router"
import { FlatList, Image, Text, View } from "react-native"
import { useAuth } from "@context/auth";
import data from '@data/hadeeth.json'
import {useEffect, useState} from "react";

const arabicNumeric = [
  require("@assets/one.png"),
  require("@assets/two.png"),
  require("@assets/three.png"),
  require("@assets/four.png")
]

const hadeethContent = () => {
    const { title, id } = useSearchParams();
    const [book, setBook] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        const getBook = data.find(b => {
            return b.id === parseInt(id)
        })
        setBook(getBook)
    }, [])

    return (
        <View className="flex-1 flex space-y-3 bg-white px-4">
            {/* <Header user={user.full_name} /> */}
            <View className="flex justify-center items-center p-3">
                <Text className="text-lg">{title}</Text>
                <Text className="text-3xl font-bold">{book?.category[0].title.ms}</Text>
                <Link href="../">Back</Link>
            </View>

            <View className="text-center flex space-y-3">
                <FlatList
                    horizontal={true}
                    data={book?.category[0].chapter}
                    renderItem={({ item }) => (
                        <Link href={{
                            pathname: `/(hadeeth)/chapter/${item.id}`,
                            params: {
                                category: book?.category[0].title.ms,
                                data: JSON.stringify(book?.category[0].chapter.find(chapter => chapter.id === parseInt(item.id)))
                            }
                        }}>
                          <View>
                            <View className="rounded-2xl border border-[#433E0E] flex items-center justify-center mt-4 w-16 h-16">
                              <Image
                                source={arabicNumeric[item.id -1]}
                                style={{ width: 30, height: 50 }}
                              />
                            </View>
                            <Text className="text-center w-11/12 mt-1 uppercase text-xs">Chapter {item.id}</Text>
                          </View>
                        </Link>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}

export default hadeethContent
