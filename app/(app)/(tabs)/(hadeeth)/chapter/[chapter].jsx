import { Link, useSearchParams } from "expo-router"
import { ScrollView, Text, View} from "react-native"

const hadeethContent = () => {
  const { chapter, data, category } = useSearchParams();
  const parsedData = data ? JSON.parse(data) : {}

  return (
    <ScrollView>
      <View className="flex items-center px-6">
        <Text className="text-3xl font-bold">{category}</Text>
        <Text className="text-lg font-bold">Chapter: {chapter}</Text>
        <Text className="text-md mb-2">{parsedData?.title?.ar}</Text>
        <Text className="text-md">{parsedData?.title?.ms}</Text>

        {/* create a next and prev chapter */}
        <View className="my-8">
          {parsedData?.hadeeth?.map(hadeeth => {
            return (
              <View key={hadeeth.id}>
                <Text className="mb-4">{hadeeth.content.ar}</Text>
                <Text className="mb-4">{hadeeth.content.ms}</Text>
              </View>
            )
          })}
        </View>
        <Link href={`Content/Hadeeth/chapter/${parseInt(chapter) + 1}`}>
          <Text>Next Chapter</Text>
        </Link>

        <Link href={`Content/Hadeeth/chapter/${parseInt(chapter) - 1}`}>
          <Text>Prev Chapter</Text>
        </Link>

      <Link href="../">Back</Link>
       </View>
    </ScrollView>
  )
}

export default hadeethContent