import { Link, useSearchParams } from "expo-router"
import { FlatList, SectionList, Text, View } from "react-native"
import { useAuth } from "@context/auth";
import data from '../../../data/hadeeth.json'
import {useEffect, useState} from "react";

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
        <View className="flex-1 flex space-y-3 bg-white">
            {/* <Header user={user.full_name} /> */}
            <View className="flex justify-center items-center p-3">
                <Text className="text-lg">{title}</Text>
                <Text className="text-3xl font-bold">{book?.category[0].title.ms}</Text>
                <Link href="Content/Hadeeth">Back</Link>
            </View>

            <View className="text-center flex space-y-3">
                <FlatList
                    data={book?.category[0].chapter}
                    renderItem={({ item }) => (
                        <Link href={{
                            pathname: `Content/Hadeeth/chapter/${item.id}`,
                            params: {
                                category: book?.category[0].title.ms,
                                data: JSON.stringify(book?.category[0].chapter.find(chapter => chapter.id === parseInt(item.id)))
                            }
                        }}>
                            <Text>Chapter {item.id}</Text>
                        </Link>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}

export default hadeethContent