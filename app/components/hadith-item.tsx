import React from 'react'
import { View, Text } from 'react-native'
import QuranText from './quran-text'
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'

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
  id: string | number;
  _id: string;
  content: BilingualContent[];
  footnotes?: Footnote[];
}

interface HadithItemProps {
  hadith: Hadith;
  footnoteRefs: React.MutableRefObject<Record<string, any>>;
}

const HadithItem = React.memo<HadithItemProps>(({ hadith, footnoteRefs }) => {
  return (
    <View key={hadith.id}>
      {hadith.content.map((content, i) => {
        if (!content.ar) return null
        return (
          <View key={i}>
            <View className="px-4 py-6 gap-6">
              <Text
                className="text-gray-800 text-2xl leading-10 mb-2 font-arabic-regular"
                style={{
                  writingDirection: 'rtl'
                }}
              >
                <QuranText text={content.ar} />
              </Text>
              <Text
                className="text-gray-800 pb-4 text-lg overflow-hidden leading-relaxed text-justify tracking-tight font-arabic-symbols"
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
              <FootnotesReference hadith={hadith} type={'content.ms'} />
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default HadithItem
