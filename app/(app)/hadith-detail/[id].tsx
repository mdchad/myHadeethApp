import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  View,
  ScrollView,
  Text,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGetHadith } from '../../shared/fetcher/useHadiths'
import { useReadingSettingsStore } from '@/app/stores/useReadingSettingsStore'
import { useUniwind } from 'uniwind'
import Page from '../../components/page'
import { usePostHog } from 'posthog-react-native'
import LoadingSpinner from '@/app/components/loading-spinner'
import FootnotesMarker from '@/app/components/footnotes-marker'
import FootnotesReference from '@/app/components/footnotes-reference'
import QuranText from '@/app/components/quran-text'
import SpecialText from '@/app/components/special-text'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import ReadingSettingsSheet from '@/app/components/reading-settings'
import BottomSheet from '@gorhom/bottom-sheet'
import ReadingTopBar from '@/app/components/reading-top-bar'
import ReadingBottomBar from '@/app/components/reading-bottom-bar'
import ChapterTitle from '@/app/components/chapter-title'
import { latinFontSizes, arabicFontSizes } from '@/app/shared/fontSizeConfig'
import HadithItem from '@/app/components/hadith-item'

function UniversalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const footnoteRefs = useRef<Record<string, any>>({})
  const posthog = usePostHog()
  const insets = useSafeAreaInsets()
  const { theme } = useUniwind()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { isLoading, data, isError } = useGetHadith(id)

  // Animation state for top and bottom bars
  const topBarTranslateY = useSharedValue(0)
  const bottomBarTranslateY = useSharedValue(0)
  const [barsVisible, setBarsVisible] = useState(true)
  const [bottomBarHeight, setBottomBarHeight] = useState(100)

  // Scroll tracking
  const lastScrollY = useRef(0)
  const scrollThreshold = 5 // Minimum scroll distance to trigger hide/show

  useEffect(() => {
    if (data) {
      posthog.capture('hadith_viewed', {
        hadith_id: data._id,
        book: data.book_title?.ms,
        volume: data.volume_title?.ms
      })
    }
  }, [data])

  const onSave = () => {
    // TODO: Implement save logic if needed
  }

  // Show bars function
  const showBars = () => {
    topBarTranslateY.value = withTiming(0, { duration: 300 })
    bottomBarTranslateY.value = withTiming(0, { duration: 300 })
    setBarsVisible(true)
  }

  // Hide bars function
  const hideBars = () => {
    // Hide top bar above the safe area
    topBarTranslateY.value = withTiming(-(100 + insets.top), { duration: 300 })
    // Hide bottom bar below the safe area using measured height
    bottomBarTranslateY.value = withTiming(bottomBarHeight, {
      duration: 300
    })
    setBarsVisible(false)
  }

  // Handle scroll event
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    if (Math.abs(scrollDiff) > scrollThreshold) {
      if (scrollDiff > 0 && barsVisible) {
        // Scrolling down - hide bars
        hideBars()
      }
      lastScrollY.current = currentScrollY
    }
  }

  // Handle touch/press on content
  const handleContentPress = () => {
    if (barsVisible) {
      hideBars()
    } else {
      showBars()
    }
  }

  const handlePresentModalPress = () => {
    bottomSheetRef.current?.snapToIndex(1)
    hideBars()
  }

  // Animated styles
  const topBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topBarTranslateY.value }]
  }))

  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomBarTranslateY.value }]
  }))

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data && !isLoading) {
    return <Text>Hadith not found</Text>
  }

  return (
    <Page edges={['top']} className="bg-reading-background">
      <StatusBar hidden={!barsVisible} style={theme === 'dark' ? 'light' : 'dark'} />
      {/* Sticky Top Bar */}
      <ReadingTopBar
        animatedStyle={topBarAnimatedStyle}
        onBackPress={() => router.back()}
        onSettingsPress={handlePresentModalPress}
      />

      <ScrollView
        className="bg-reading-background"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Pressable onPress={handleContentPress}>
          <View className="flex-1 pb-0 bg-reading-background pt-20">
            <View className="flex-1">
              {data?.chapter_title?.ms && (
                <ChapterTitle data={data} footnoteRefs={footnoteRefs}/>
              )}
              <View className="space-y-8 bg-reading-background mb-20">
                <HadithItem hadith={data} footnoteRefs={footnoteRefs} />
              </View>
            </View>
          </View>
        </Pressable>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <ReadingBottomBar
        animatedStyle={bottomBarAnimatedStyle}
        hadithData={data}
        footnoteRefs={footnoteRefs}
        onLayout={setBottomBarHeight}
      />
      <ReadingSettingsSheet bottomSheetRef={bottomSheetRef}/>
    </Page>
  )
}

export default UniversalDetail
