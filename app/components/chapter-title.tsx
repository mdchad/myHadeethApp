import { Text, View } from 'react-native'
import QuranText from '@/app/components/quran-text'
import FootnotesMarker from '@/app/components/footnotes-marker'
import SpecialText from '@/app/components/special-text'
import FootnotesReference from '@/app/components/footnotes-reference'
import React from 'react'
import type { Chapter, Footnote } from '@/app/types'

interface ChapterTitleProps {
  chapter: (Chapter & { id?: string }) | null | undefined;
  footnotes?: Footnote[];
  footnoteRefs: React.RefObject<Record<string, any>>;
}

function ChapterTitle({ chapter, footnotes = [], footnoteRefs }: ChapterTitleProps) {
  if (!chapter) return null

  const chapterId = chapter.id

  return (
    <View className="mb-10 p-4 gap-4">
      <View className="gap-4 border-l-4 border-royal-blue-950 dark:border-royal-blue-700 pl-2">
        <Text
          className="text-lg text-royal-blue-950 dark:text-white font-arabic-bold font-bold"
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
              hadithId={chapterId}
            >
              <SpecialText
                className="text-royal-blue-950 dark:text-white font-semibold"
                text={chapter.title_ms}
              />
            </FootnotesMarker>
          </Text>
          {!!chapter.transliteration_ms && (
            <Text className="text-gray-600 dark:text-white mt-1">
              {chapter.transliteration_ms}
            </Text>
          )}
        </View>
      </View>
      {!!chapter.metadata_ms && (
        <View className="gap-4 border-l-4 border-gray-400 pl-2">
          <Text
            className="text-lg text-gray-800 dark:text-white leading-8 font-arabic-regular"
            style={{
              writingDirection: 'rtl'
            }}
          >
            <QuranText text={chapter.metadata_ar} />
          </Text>
          <Text
            className="italic text-gray-700 dark:text-white leading-6 text-justify tracking-tight font-arabic-symbols"
            style={{
              writingDirection: 'ltr'
            }}
          >
            <FootnotesMarker
              footnotes={footnotes}
              type={'chapter_metadata.ms'}
              index={1}
              footnoteRefs={footnoteRefs}
              hadithId={chapterId}
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

export default ChapterTitle
