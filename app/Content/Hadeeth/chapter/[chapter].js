import { Link, useSearchParams } from "expo-router"
import { SectionList, Text, View } from "react-native"

const hadeethContent = () => {
    const {chapter} = useSearchParams();

    return (
        <View>
            <Text>Chapter: {chapter}</Text>

            {/* create a next and prev chapter */}
            <Link href={`Content/Hadeeth/chapter/${parseInt(chapter) + 1}`}>
                <Text>Next Chapter</Text>
            </Link>

            <Link href={`Content/Hadeeth/chapter/${parseInt(chapter) - 1}`}>
                <Text>Prev Chapter</Text>
            </Link>

            <Link href="Content/Hadeeth">Back</Link>
        </View>
    )
}

export default hadeethContent