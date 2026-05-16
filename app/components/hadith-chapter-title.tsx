import React from 'react'
import { View, Text } from 'react-native'
import QuranText from './quran-text'
import SpecialText from './special-text'
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'
import type { Chapter, Footnote } from '@/app/types'

interface HadithChapterTitleProps {
  chapter: (Chapter & { id?: string }) | null | undefined;
  footnotes?: Footnote[];
  footnoteRefs: React.RefObject<Record<string, any>>;
}

const HadithChapterTitle: React.FC<HadithChapterTitleProps> = ({
  chapter,
  footnotes = [],
  footnoteRefs,
}) => {
  if (!chapter) return null

  return (
    <View className="bg-gray-100 rounded-xl mb-4 p-4 gap-10">
      <View className="gap-4">
        <Text
          className="text-lg text-royal-blue-950 font-arabic-bold font-bold"
          style={{
            writingDirection: 'rtl'
          }}
        >
          <QuranText text={chapter.title_ar} font={'arabic-bold'} />
        </Text>
        <View>
          <Text>
            <FootnotesMarker
              footnotes={footnotes}
              type={'chapter_title.ms'}
              index={1}
              footnoteRefs={footnoteRefs}
              hadithId={chapter.id}
            >
              <SpecialText
                className="text-royal-blue-950 font-semibold"
                text={chapter.title_ms}
              />
            </FootnotesMarker>
          </Text>
          {!!chapter.transliteration_ms && (
            <Text className="text-gray-600 mt-1">
              {chapter.transliteration_ms}
            </Text>
          )}
        </View>
      </View>
      {!!chapter.metadata_ms && (
        <View className="gap-4">
          <Text
            className="text-lg text-gray-800 leading-8 font-arabic-regular"
            style={{
              writingDirection: 'rtl'
            }}
          >
            <QuranText text={chapter.metadata_ar} />
          </Text>
          <Text
            className="text-gray-700 leading-6 text-justify tracking-tight font-arabic-symbols"
            style={{
              writingDirection: 'ltr'
            }}
          >
            <FootnotesMarker
              footnotes={footnotes}
              type={'chapter_metadata.ms'}
              index={1}
              footnoteRefs={footnoteRefs}
              hadithId={chapter.id}
            >
              <QuranText
                text={chapter.metadata_ms}
                font={'arabic-symbols'}
                special={true}
              />
            </FootnotesMarker>
          </Text>
          <FootnotesReference footnotes={footnotes} type={'chapter_title.ms'} />
          <FootnotesReference footnotes={footnotes} type={'chapter_metadata.ms'} />
        </View>
      )}
    </View>
  )
}

export default HadithChapterTitle
