import React, { useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated from 'react-native-reanimated'
import FootnotesMarker from '@/app/components/footnotes-marker'
import FootnotesReference from '@/app/components/footnotes-reference'
import { Button } from 'heroui-native'
import { ChevronDownIcon, PlayIcon } from 'lucide-react-native'
import { useAudioPlayerStore } from '@/app/stores/useAudioPlayerStore'
import * as Haptics from 'expo-haptics'
import type { Book, Footnote, Hadith, Volume } from '@/app/types'

interface ReadingBottomBarProps {
  animatedStyle: any
  book: Book | null | undefined
  volume: Volume | null | undefined
  volumeFootnotes?: Footnote[]
  allHadiths?: Hadith[]
  footnoteRefs: React.RefObject<Record<string, any>>
  onLayout?: (height: number) => void
  onHide?: () => void
}

const ReadingBottomBar: React.FC<ReadingBottomBarProps> = ({
  animatedStyle,
  book,
  volume,
  volumeFootnotes = [],
  allHadiths,
  footnoteRefs,
  onLayout,
  onHide,
}) => {
  const insets = useSafeAreaInsets()
  const { playPlaylist } = useAudioPlayerStore()
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false)

  const handlePlayAll = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }

    if (!allHadiths || allHadiths.length === 0) {
      return
    }

    setIsLoadingPlaylist(true)

    const R2_BASE_URL =
      'https://pub-34bac4a6ce3242dabed8105f8908b2ee.r2.dev/myway-voiceover'
    const playlist = []

    // Build playlist: for each hadith, for each content block
    for (const hadith of allHadiths) {
      if (!hadith.audio_files) continue

      // Get all content blocks
      const contentCount = hadith.content?.length || 0
      for (let i = 0; i < contentCount; i++) {
        const audioContent = `content${i}`
        const arUrl = hadith.audio_files.ar?.[audioContent]
        const msUrl = hadith.audio_files.ms?.[audioContent]

        if (arUrl && msUrl) {
          playlist.push({
            urls: [`${R2_BASE_URL}/${arUrl}`, `${R2_BASE_URL}/${msUrl}`],
            title: `Hadis [${hadith.label}] - (${i + 1})`,
            subtitle: hadith.id,
          })
        }
      }
    }

    if (playlist.length > 0) {
      playPlaylist(playlist)
    }

    setIsLoadingPlaylist(false)
  }

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
        {/* Book title - half outside, half inside */}
        <View className="absolute -top-4 left-0 right-0 px-6 z-10">
          <View className="bg-royal-blue-950 dark:bg-royal-blue-700 py-2 rounded-xs">
            <Text className="text-white text-xl text-center">
              {book?.title_ms}
            </Text>
          </View>
        </View>

        <View className="px-6 gap-8 mt-4">
          <View className="gap-2 pb-4">
            <View className="flex flex-row gap-2 items-center">
              {onHide && (
                <Button
                  isIconOnly
                  className="bg-gray-100"
                  onPress={onHide}
                >
                  <ChevronDownIcon size={20} color="black" />
                </Button>
              )}
              <Button
                isIconOnly
                className="bg-gray-100"
                onPress={handlePlayAll}
                isDisabled={
                  isLoadingPlaylist || !allHadiths || allHadiths.length === 0
                }
              >
                {isLoadingPlaylist ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <PlayIcon size={28} color="white" fill="black" />
                )}
              </Button>
              <View className="flex items-start">
                <FootnotesMarker
                  footnotes={volumeFootnotes}
                  type={'volume_title.ms'}
                  index={1}
                  footnoteRefs={footnoteRefs}
                  hadithId={volume?.id}
                >
                  <Text className={`text-sm ${volumeFootnotes.length ? 'leading-10' : ''} text-center capitalize font-semibold text-royal-blue-950 dark:text-white`}>
                    {volume?.title_ms}
                  </Text>
                </FootnotesMarker>
                <Text className="text-lg text-center font-semibold text-royal-blue-950 dark:text-white font-arabic-regular">
                  {volume?.title_ar}
                </Text>
              </View>
            </View>
            <FootnotesReference footnotes={volumeFootnotes} type={'volume_title.ms'} />
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

export default ReadingBottomBar
