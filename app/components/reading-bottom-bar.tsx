import React from 'react'
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { AnimatedStyleProp, ViewStyle } from 'react-native-reanimated'
import FootnotesMarker from '@/app/components/footnotes-marker'
import FootnotesReference from '@/app/components/footnotes-reference'

interface BilingualContent {
  ms?: string
  ar?: string
}

interface HadithData {
  _id: string
  book_title: BilingualContent
  volume_title: BilingualContent
  footnotes?: any[]
}

interface HadithDetailBottomBarProps {
  animatedStyle: AnimatedStyleProp<ViewStyle>
  hadithData: HadithData
  footnoteRefs: React.RefObject<Record<string, any>>
  onLayout?: (height: number) => void
}

const ReadingBottomBar: React.FC<HadithDetailBottomBarProps> = ({
  animatedStyle,
  hadithData,
  footnoteRefs,
  onLayout
}) => {
  const insets = useSafeAreaInsets()

  return (
    <Animated.View
      style={[animatedStyle]}
      className="absolute bottom-0 left-0 right-0 z-50"
    >
      <View
        onLayout={(event) => {
          if (onLayout) {
            const { height } = event.nativeEvent.layout
            onLayout(height)
          }
        }}
        style={{ paddingBottom: insets.bottom, paddingTop: 30 }}
        className="bg-reading-background border-t-2 border-reading-border"
      >
        <View className="px-6 gap-8">
          <View className="bg-royal-blue-950 dark:bg-royal-blue-700 py-2">
            <Text className=" text-white text-xl text-center">
              {hadithData.book_title.ms}
            </Text>
          </View>
          <View className="gap-2 pb-4">
            <View className="flex items-center">
              <View className="flex-1">
                <FootnotesMarker
                  footnotes={hadithData.footnotes}
                  type={'volume_title.ms'}
                  index={1}
                  footnoteRefs={footnoteRefs}
                  hadithId={hadithData._id}
                >
                  <Text className="text-sm leading-10 text-center capitalize font-semibold text-royal-blue-950 dark:text-white">
                    {hadithData.volume_title.ms}
                  </Text>
                </FootnotesMarker>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-lg text-center font-semibold text-royal-blue-950 dark:text-white font-arabic-regular">
                  {hadithData.volume_title.ar}
                </Text>
              </View>
            </View>
            <FootnotesReference hadith={hadithData} type={'volume_title.ms'} />
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

export default ReadingBottomBar
