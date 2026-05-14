import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  Pressable,
  Keyboard,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGetHadith } from '../../shared/fetcher/useHadiths'
import { useUniwind } from 'uniwind'
import Page from '../../components/page'
import { usePostHog } from 'posthog-react-native'
import LoadingSpinner from '@/app/components/loading-spinner'
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import ReadingSettingsSheet from '@/app/components/reading-settings'
import BottomSheet from '@gorhom/bottom-sheet'
import ReadingTopBar from '@/app/components/reading-top-bar'
import ReadingBottomBar from '@/app/components/reading-bottom-bar'
import ChapterTitle from '@/app/components/chapter-title'
import HadithItem from '@/app/components/hadith-item'
import { useReadingBottomBarStore } from '@/app/stores/useReadingBottomBarStore'

function UniversalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const footnoteRefs = useRef<Record<string, any>>({})
  const posthog = usePostHog()
  const insets = useSafeAreaInsets()
  const { theme } = useUniwind()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { isLoading, data } = useGetHadith(id)

  const { setVisible: setBottomBarVisible, setHeight: setBottomBarHeightStore } = useReadingBottomBarStore()

  const topBarTranslateY = useSharedValue(0)
  const bottomBarTranslateY = useSharedValue(0)
  const [barsVisible, setBarsVisible] = useState(true)
  const [bottomBarHeight, setBottomBarHeight] = useState(100)

  useEffect(() => {
    if (data) {
      posthog.capture('hadith_viewed', {
        hadith_id: data.id,
        book: data.book?.title_ms,
        volume: data.volume?.title_ms,
      })
    }
  }, [data])

  const showBars = () => {
    topBarTranslateY.value = withTiming(0, { duration: 300 })
    bottomBarTranslateY.value = withTiming(0, { duration: 300 })
    setBarsVisible(true)
    setBottomBarVisible(true)
  }

  const hideBars = () => {
    topBarTranslateY.value = withTiming(-(100 + insets.top), { duration: 300 })
    bottomBarTranslateY.value = withTiming(bottomBarHeight, { duration: 300 })
    setBarsVisible(false)
    setBottomBarVisible(false)
  }

  const handleBottomBarLayout = (height: number) => {
    setBottomBarHeight(height)
    setBottomBarHeightStore(height)
  }

  const handleContentPress = () => {
    if (barsVisible) hideBars()
    else showBars()
  }

  const handlePresentModalPress = () => {
    bottomSheetRef.current?.snapToIndex(1)
    hideBars()
    Keyboard.dismiss()
  }

  const topBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topBarTranslateY.value }],
  }))

  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomBarTranslateY.value + 16 }],
  }))

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data) {
    return <Text>Hadith not found</Text>
  }

  return (
    <Page className="bg-reading-background">
      <StatusBar hidden={!barsVisible} style={theme === 'dark' ? 'light' : 'dark'} />
      <ReadingTopBar
        animatedStyle={topBarAnimatedStyle}
        onBackPress={() => router.back()}
        onSettingsPress={handlePresentModalPress}
      />

      <ScrollView className="bg-reading-background" scrollEventThrottle={16}>
        <Pressable onPress={handleContentPress}>
          <View className="flex-1 pb-0 bg-reading-background pt-40">
            <View className="flex-1">
              {data.chapter && (
                <ChapterTitle
                  chapter={data.chapter}
                  footnotes={data.footnotes?.chapter}
                  footnoteRefs={footnoteRefs}
                />
              )}
              <View className="space-y-8 bg-reading-background mb-20">
                <HadithItem hadith={data} footnoteRefs={footnoteRefs} />
              </View>
            </View>
          </View>
        </Pressable>
      </ScrollView>

      <ReadingBottomBar
        animatedStyle={bottomBarAnimatedStyle}
        book={data.book}
        volume={data.volume}
        volumeFootnotes={data.footnotes?.volume}
        footnoteRefs={footnoteRefs}
        onLayout={handleBottomBarLayout}
        onHide={hideBars}
      />
      <ReadingSettingsSheet bottomSheetRef={bottomSheetRef} />
    </Page>
  )
}

export default UniversalDetail
