import { Link, useRouter, useSearchParams } from "expo-router"
import { FlatList, ScrollView, Text, View } from "react-native"
import chapters from '@data/chapters.json'
import categories from '@data/categories.json'
import { ChevronRight } from "lucide-react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Item from "../../../../components/accordion";
import Accordion from "../../../../components/accordion";
let he = require('he');
import { FlashList } from "@shopify/flash-list";

const hadeethCategory = () => {
    const { title, id } = useSearchParams();
    const router = useRouter();

    function onPressHadith(categories) {
        return router.push({
            pathname: `/(hadeeth)/content/${categories.id}`,
            params: {
                categoriesId: categories.id,
                bookId: categories.book_id,
            }
        })
    }

    // filter categories by book id
    const filteredCategories = categories.filter(category => category.book_id === id)

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 space-y-6 flex bg-gray-100 px-6 pt-6">
                <FlashList
                    className="space-y-6"
                    data={filteredCategories}
                    renderItem={({ item }) => <TouchableHighlight key={item.id} onPress={() => onPressHadith(item)} underlayColor="#f9fafb" className="rounded-xl w-full mb-3 overflow-hidden">
                        <View key={item.id} className="px-4 py-4 bg-white">
                            <View className="flex flex-row justify-between items-center w-full">
                                <Text className="capitalize text-lg font-semibold">{he.decode(item.title.ms)}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>}
                    estimatedItemSize={100}
                />
            </View>
        </ScrollView>
    )
}

export default hadeethCategory
