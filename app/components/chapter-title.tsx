import { Text, View } from 'react-native'
import QuranText from '@/app/components/quran-text'
import FootnotesMarker from '@/app/components/footnotes-marker'
import SpecialText from '@/app/components/special-text'
import FootnotesReference from '@/app/components/footnotes-reference'
import React from 'react'

function ChapterTitle({ data, footnoteRefs }: { data: any; footnoteRefs: any}) {
  return (
    <View className="mb-10 p-4 gap-4">
      <View className="gap-4 border-l-4 border-royal-blue-950 dark:border-royal-blue-700 pl-2">
        <Text
          className="text-lg text-royal-blue-950 dark:text-white font-arabic-bold font-bold"
          style={{
            writingDirection: 'rtl'
          }}
        >
          <QuranText text={data?.chapter_title?.ar} font={'arabic-bold'} />
        </Text>
        <View>
          <Text>
            <FootnotesMarker
              footnotes={data.footnotes}
              type={'chapter_title.ms'}
              index={1}
              footnoteRefs={footnoteRefs}
              hadithId={data._id}
            >
              <SpecialText
                className="text-royal-blue-950 dark:text-white font-semibold"
                text={data?.chapter_title?.ms}
              />
            </FootnotesMarker>
          </Text>
          <Text className="text-gray-600 dark:text-white mt-1">
            {data?.chapter_transliteration?.ms}
          </Text>
        </View>
      </View>
      {data?.chapter_metadata?.ms && (
        <View className="gap-4 border-l-4 border-gray-400 pl-2">
          <Text
            className="text-lg text-gray-800 dark:text-white leading-8 font-arabic-regular"
            style={{
              writingDirection: 'rtl'
            }}
          >
            <QuranText text={data?.chapter_metadata?.ar} />
          </Text>
          <Text
            className="italic text-gray-700 dark:text-white leading-6 text-justify tracking-tight font-arabic-symbols"
            style={{
              writingDirection: 'ltr'
            }}
          >
            <FootnotesMarker
              footnotes={data.footnotes}
              type={'chapter_metadata.ms'}
              index={1}
              footnoteRefs={footnoteRefs}
              hadithId={data._id}
            >
              <QuranText
                text={data?.chapter_metadata?.ms}
                font={'arabic-symbols'}
                special={true}
              />
            </FootnotesMarker>
          </Text>
          <FootnotesReference hadith={data} type={'chapter_title.ms'} />
          <FootnotesReference hadith={data} type={'chapter_metadata.ms'} />
        </View>
      )}
    </View>
  )
}

export default ChapterTitle