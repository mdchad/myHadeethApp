import React from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import QuranText from './quran-text'
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'
import LexicalRenderer from '@/app/components/lexical-renderer'
import { latinFontSizes, arabicFontSizes } from '@/app/shared/fontSizeConfig'
import { useReadingSettingsStore } from '@/app/stores/useReadingSettingsStore'
import { useAudioPlayerStore } from '@/app/stores/useAudioPlayerStore'
import {PlayIcon, SparkleIcon, SparklesIcon} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { Button } from 'heroui-native';

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
  number: number;
  content: BilingualContent[];
  footnotes?: Footnote[];
  audio_files?: any;
}

interface HadithItemProps {
  hadith: Hadith;
  footnoteRefs: React.RefObject<Record<string, any>>;
}

const HadithItem = React.memo<HadithItemProps>(({ hadith, footnoteRefs }) => {
  const fontSizeIndex = useReadingSettingsStore((state) => state.fontSizeIndex)
  const playTrack = useAudioPlayerStore((state) => state.playTrack)
  const R2_BASE_URL = 'https://pub-34bac4a6ce3242dabed8105f8908b2ee.r2.dev/myway-voiceover'

  const handlePlayAudio = async (contentIndex: number) => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const audioContent = `content${contentIndex}`
    playTrack({
      urls: [
        `${R2_BASE_URL}/${hadith.audio_files.ar?.[audioContent]}`,
        `${R2_BASE_URL}/${hadith.audio_files.ms?.[audioContent]}`
      ],
      title: `Hadis [${hadith?.number}] - (${contentIndex + 1})`,
      subtitle: hadith._id
    })
  }

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
                  onPress={() => handlePlayAudio(i)}
                  className="bg-white rounded-sm border border-gray-400"
                >
                  <SparklesIcon size={10} color="black" fill="black" />
                  <Button.Label className="text-black text-xs">Tanya AI</Button.Label>
                </Button>
              </View>

              <FootnotesReference hadith={hadith} type={'content.ms'} />
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default HadithItem
