import React from 'react'
import { View, Text, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import QuranText from './quran-text'
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'
import { latinFontSizes, arabicFontSizes } from '@/app/shared/fontSizeConfig'
import { useReadingSettingsStore } from '@/app/stores/useReadingSettingsStore'
import { useAudioPlayerStore } from '@/app/stores/useAudioPlayerStore'
import { PlayIcon, SparklesIcon } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { Button } from 'heroui-native'
import type { Hadith } from '@/app/types'

interface HadithItemProps {
  hadith: Hadith;
  footnoteRefs: React.RefObject<Record<string, any>>;
}

const HadithItem = React.memo<HadithItemProps>(({ hadith, footnoteRefs }) => {
  const router = useRouter()
  const fontSizeIndex = useReadingSettingsStore((state) => state.fontSizeIndex)
  const playTrack = useAudioPlayerStore((state) => state.playTrack)
  const R2_BASE_URL = 'https://pub-34bac4a6ce3242dabed8105f8908b2ee.r2.dev/myway-voiceover'

  const hadithFootnotes = hadith.footnotes?.hadith ?? []

  const handlePlayAudio = async (contentIndex: number) => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const audioContent = `content${contentIndex}`
    playTrack({
      urls: [
        `${R2_BASE_URL}/${hadith.audio_files?.ar?.[audioContent]}`,
        `${R2_BASE_URL}/${hadith.audio_files?.ms?.[audioContent]}`
      ],
      title: `Hadis [${hadith.label}] - (${contentIndex + 1})`,
      subtitle: hadith.id
    })
  }

  const handleAskAI = async (contentIndex: number) => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const content = hadith.content[contentIndex]
    router.push({
      pathname: '/hadith-chat',
      params: {
        hadithId: hadith.id,
        hadithNumber: hadith.number,
        bookTitle: hadith.book?.title_ms ?? '',
        contentAr: content.ar || '',
        contentMs: content.ms || '',
      }
    })
  }

  return (
    <View key={hadith.id}>
      {hadith.content.map((content, i) => {
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
                  footnotes={hadithFootnotes}
                  type={'content.ms'}
                  index={i + 1}
                  footnoteRefs={footnoteRefs}
                  hadithId={hadith.id}
                >
                  <QuranText
                    text={content.ms}
                    font={'arabic-symbols'}
                    special={true}
                  />
                </FootnotesMarker>
              </Text>

              {/* Play Button */}
              <View className="flex flex-row gap-2">
                <Button
                  size="sm"
                  onPress={() => handlePlayAudio(i)}
                  className="bg-royal-blue rounded-sm rounded-none"
                >
                  <PlayIcon size={10} color="white" fill="white" />
                  <Button.Label className="text-white text-xs">Main Audio</Button.Label>
                </Button>
                <Button
                  size="sm"
                  onPress={() => handleAskAI(i)}
                  className="bg-white rounded-sm border border-gray-400"
                >
                  <SparklesIcon size={10} color="black" fill="black" />
                  <Button.Label className="text-black text-xs">Tanya AI</Button.Label>
                </Button>
              </View>

              <FootnotesReference footnotes={hadithFootnotes} type={'content.ms'} />
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default HadithItem
