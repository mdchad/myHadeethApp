import { Link, useSearchParams } from "expo-router"
import { FlatList, SectionList, Text, View } from "react-native"
import { useAuth } from "@context/auth";
import Header from '@components/header';

const chapter = [
    {
        id: 1,
        title: "Chapter 1",
    },
    {
        id: 2,
        title: "Chapter 2",
    },
    {
        id: 3,
        title: "Chapter 3",
    },
    {
        id: 4,
        title: "Chapter 4",
    }
];

const hadeethContent = () => {
    const { title, id } = useSearchParams();
    const { user } = useAuth()

    return (
        <View className="flex-1 flex space-y-3 bg-white">
            {/* <Header user={user.full_name} /> */}
            <View className="flex justify-center items-center p-3">
                <Text className="text-lg">{title}</Text>
                <Link href="Content/Hadeeth">Back</Link>
            </View>

            <View className="text-center flex space-y-3">
                <Text className="text-lg">Hadeeth Info</Text>
                <Text>Chapters:</Text>
                <FlatList
                    data={chapter}
                    renderItem={({ item }) => (
                        <Link href={`Content/Hadeeth/chapter/${item.id}`}>
                            <Text>{item.title}</Text>
                        </Link>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}

export default hadeethContent