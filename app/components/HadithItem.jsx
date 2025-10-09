import React, { useRef } from 'react'
import { View, Text } from 'react-native'
import QuranText from './QuranText'
import { isEmpty } from 'es-toolkit/compat'
import FootnoteText from './footnotes-text'

const HadithItem = React.memo(({ hadith }) => {
  const footnoteRefs = useRef({})

  return (
    <View key={hadith.id}>
      {hadith.content.map((content, i) => {
        if (!content.ar) return null
        return (
          <View key={i}>
            <View className="px-4 py-6 gap-6">
              <Text
                className="text-gray-800 text-2xl leading-10 mb-2"
                style={{
                  fontFamily: 'arabic_regular',
                  writingDirection: 'rtl'
                }}
              >
                <QuranText text={content.ar} />
              </Text>
              <Text
                className="text-gray-800 pb-4 text-lg overflow-hidden leading-relaxed text-justify tracking-tight"
                style={{
                  fontFamily: 'arabic_symbols',
                  writingDirection: 'ltr'
                }}
              >
                <FootnoteText
                  footnotes={hadith.footnotes}
                  type={'content.ms'}
                  index={i + 1}
                  footnoteRefs={footnoteRefs}
                  hadithId={hadith._id}
                >
                  <QuranText
                    text={content.ms}
                    font={'arabic_symbols'}
                    special={true}
                  />
                </FootnoteText>
              </Text>
              <View className="lg:hidden ">
                {!(
                  isEmpty(hadith.footnotes) || hadith.footnotes.every(isEmpty)
                ) &&
                  hadith.footnotes.map((footnote, footnoteIndex) => (
                    <View
                      key={footnoteIndex}
                      className="mt-2 flex flex-row items-start gap-1"
                    >
                      <Text className="text-blue-900/80 text-xs font-bold">
                        {footnote.number}
                      </Text>
                      <Text className="text-[#97999c] font-semibold text-sm">
                        {footnote.ms}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default HadithItem
