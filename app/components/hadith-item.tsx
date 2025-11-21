import React from 'react'
import { View, Text } from 'react-native'
import QuranText from './quran-text'
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'
import LexicalRenderer from '@/app/components/lexical-renderer'
import { latinFontSizes, arabicFontSizes } from '@/app/shared/fontSizeConfig'
import { useReadingSettingsStore } from '@/app/stores/useReadingSettingsStore'

interface BilingualContent {
  ms?: string;
  ar?: string;
}

interface Footnote {
  position: number;
  number: number;
  type: string;
  hadithIndex: number;
  ms?: string;
  ar?: string;
}

interface Hadith {
  id?: string | number;
  _id?: string;
  content: BilingualContent[];
  footnotes?: Footnote[];
}

interface HadithItemProps {
  hadith: Hadith;
  footnoteRefs: React.RefObject<Record<string, any>>;
}

const HadithItem = React.memo<HadithItemProps>(({ hadith, footnoteRefs }) => {
  const fontSizeIndex = useReadingSettingsStore((state) => state.fontSizeIndex)

  return (
    <View key={hadith._id}>
      {hadith.content.map((content: any, i) => {
        if (!content.ar) return null
        return (
          <View key={i}>
            <View className="px-4 py-6 gap-6">
              <Text
                className={`text-reading-text ${arabicFontSizes[fontSizeIndex].size} ${arabicFontSizes[fontSizeIndex].leading} ${arabicFontSizes[fontSizeIndex].tracking} mb-2 font-arabic-regular`}
                style={{
                  writingDirection: 'rtl'
                }}
              >
                <QuranText text={content.ar} />
              </Text>
              <Text
                className={`text-reading-text pb-4 ${latinFontSizes[fontSizeIndex].size} ${latinFontSizes[fontSizeIndex].leading} ${latinFontSizes[fontSizeIndex].tracking} overflow-hidden text-justify font-arabic-symbols`}
                style={{
                  writingDirection: 'ltr'
                }}
              >
                <FootnotesMarker
                  footnotes={hadith.footnotes}
                  type={'content.ms'}
                  index={i + 1}
                  footnoteRefs={footnoteRefs}
                  hadithId={hadith._id}
                >
                  <QuranText
                    text={content.ms}
                    font={'arabic-symbols'}
                    special={true}
                  />
                </FootnotesMarker>
              </Text>

              {/*<LexicalRenderer*/}
              {/*  serializedState={hadith?.lexicalState?.content[i]?.ms}*/}
              {/*  className=" text-gray-800 text-lg text-justify tracking-tight font-arabic-symbols leading-relaxed"*/}
              {/*  footnoteRefs={footnoteRefs}*/}
              {/*  hadithId={hadith._id}*/}
              {/*/>*/}
              <FootnotesReference hadith={hadith} type={'content.ms'} />
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default HadithItem
