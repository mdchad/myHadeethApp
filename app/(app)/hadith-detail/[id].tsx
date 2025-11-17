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
import {
  ALargeSmallIcon,
  Bookmark,
  BookmarkIcon,
  ChevronLeft,
  ChevronLeftCircle,
  SearchIcon,
  Share2
} from 'lucide-react-native'
import Slider, { MarkerProps } from '@react-native-community/slider'
import { Slider as NSlider } from '@react-native-assets/slider'
import ReadingSettingsSheet from '@/app/components/reading-settings'
import BottomSheet from '@gorhom/bottom-sheet'
import { withUniwind } from 'uniwind'

function UniversalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const footnoteRefs = useRef<Record<string, any>>({})
  const bottomBarRef = useRef<View>(null)
  const posthog = usePostHog()
  const insets = useSafeAreaInsets()
  const fontSizeIndex = useReadingSettingsStore((state) => state.fontSizeIndex)
  const { theme } = useUniwind()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { isLoading, data, isError } = useGetHadith(id)

  // Font size configuration
  // Latin script sizes (for Malay text)
  const latinFontSizes = [
    { size: 'text-xs', leading: 'leading-relaxed', tracking: 'tracking-wide' },
    { size: 'text-sm', leading: 'leading-relaxed', tracking: 'tracking-wide' },
    {
      size: 'text-base',
      leading: 'leading-relaxed',
      tracking: 'tracking-normal'
    },
    {
      size: 'text-lg',
      leading: 'leading-relaxed',
      tracking: 'tracking-normal'
    },
    {
      size: 'text-xl',
      leading: 'leading-relaxed',
      tracking: 'tracking-tighter'
    }
  ]
  // Arabic script sizes (2 sizes larger than Latin)
  const arabicFontSizes = [
    { size: 'text-base', leading: 'leading-8', tracking: 'tracking-normal' },
    { size: 'text-lg', leading: 'leading-9', tracking: 'tracking-normal' },
    { size: 'text-xl', leading: 'leading-10', tracking: 'tracking-normal' },
    { size: 'text-2xl', leading: 'leading-10', tracking: 'tracking-normal' },
    {
      size: 'text-3xl',
      leading: 'leading-relaxed',
      tracking: 'tracking-normal'
    }
  ]

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

  const StyledALargeSmallIcon = withUniwind(ALargeSmallIcon)
  const StyledBookmarkIcon = withUniwind(BookmarkIcon)
  const StyledSearchIcon = withUniwind(SearchIcon)
  const StyledChevronLeft = withUniwind(ChevronLeft)

  return (
    <Page className="bg-reading-background">
      <StatusBar hidden={!barsVisible} style={theme === 'dark' ? 'light' : 'dark'} />
      {/* Sticky Top Bar */}
      <Animated.View
        style={[topBarAnimatedStyle]}
        className="absolute top-0 left-0 right-0 z-50 bg-reading-background px-4"
      >
        <View style={{ paddingTop: insets.top, paddingBottom: 10 }} className="border-b-2 border-reading-border flex flex-row justify-between">
          <View className="flex flex-row">
            <Pressable
              className="flex flex-row"
              onPress={() => router.back()}
            >
              <StyledChevronLeft className="text-reading-text" size={28}></StyledChevronLeft>
              <Text className="text-xl text-reading-text">Back</Text>
            </Pressable>
          </View>
          <View className="flex flex-row gap-2">
            <StyledSearchIcon className="text-reading-text" size={28} strokeWidth={2}/>
            <Pressable
              className="flex flex-row"
              onPress={handlePresentModalPress}
            >
              <StyledALargeSmallIcon className="text-reading-text" size={28} strokeWidth={2}/>
            </Pressable>
            <StyledBookmarkIcon className="text-reading-text" size={28} strokeWidth={2}/>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        className="bg-reading-background"
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Pressable onPress={handleContentPress}>
          <View className="flex-1 pb-0 bg-reading-background pt-16">
            <View className="flex-1">
              {data?.chapter_title?.ms && (
                <View className="mb-10 p-4 gap-10">
                  <View className="gap-4 border-l-4 border-royal-blue pl-2">
                    <Text
                      className="text-lg text-royal-blue font-arabic-bold font-bold"
                      style={{
                        writingDirection: 'rtl'
                      }}
                    >
                      <QuranText
                        text={data?.chapter_title?.ar}
                        font={'arabic-bold'}
                      />
                    </Text>
                    <View>
                      <Text>
                        <FootnotesMarker
                          footnotes={data.footnotes}
                          type={'chapter_title.ms'}
                          index={1}
                          footnoteRefs={footnoteRefs}
                          hadithId={data._id}
                        >
                          <SpecialText
                            className="text-royal-blue font-semibold"
                            text={data?.chapter_title?.ms}
                          />
                        </FootnotesMarker>
                      </Text>
                      <Text className="text-gray-600 mt-1">
                        {data?.chapter_transliteration?.ms}
                      </Text>
                    </View>
                  </View>
                  {data?.chapter_metadata?.ms && (
                    <View className="gap-4 border-l-4 border-gray-400 pl-2">
                      <Text
                        className="text-lg text-gray-800 leading-8 font-arabic-regular"
                        style={{
                          writingDirection: 'rtl'
                        }}
                      >
                        <QuranText text={data?.chapter_metadata?.ar} />
                      </Text>
                      <Text
                        className="text-gray-700 leading-6 text-justify tracking-tight font-arabic-symbols"
                        style={{
                          writingDirection: 'ltr'
                        }}
                      >
                        <FootnotesMarker
                          footnotes={data.footnotes}
                          type={'chapter_metadata.ms'}
                          index={1}
                          footnoteRefs={footnoteRefs}
                          hadithId={data._id}
                        >
                          <QuranText
                            text={data?.chapter_metadata?.ms}
                            font={'arabic-symbols'}
                            special={true}
                          />
                        </FootnotesMarker>
                      </Text>
                      <FootnotesReference
                        hadith={data}
                        type={'chapter_title.ms'}
                      />
                      <FootnotesReference
                        hadith={data}
                        type={'chapter_metadata.ms'}
                      />
                    </View>
                  )}
                </View>
              )}
              <View className="space-y-8 bg-reading-background mb-20">
                <View key={data.id}>
                  {data.content.map((content, i) => {
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
                              footnotes={data.footnotes}
                              type={'content.ms'}
                              index={i + 1}
                              footnoteRefs={footnoteRefs}
                              hadithId={data._id}
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
                          <FootnotesReference
                            hadith={data}
                            type={'content.ms'}
                          />
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <Animated.View
        style={[bottomBarAnimatedStyle]}
        className="absolute bottom-0 left-0 right-0 z-50"
      >
        <View
          ref={bottomBarRef}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout
            setBottomBarHeight(height)
          }}
          style={{ paddingBottom: insets.bottom, paddingTop: 10 }}
          className="bg-reading-background border-t-2 border-reading-border"
        >
          <View className="px-6 gap-4">
            <View className="bg-royal-blue py-2">
              <Text className=" text-white text-xl text-center">{data.book_title.ms}</Text>
            </View>
            <View>
              <View className="flex items-center">
                <View className="flex-1">
                  <FootnotesMarker
                    footnotes={data.footnotes}
                    type={'volume_title.ms'}
                    index={1}
                    footnoteRefs={footnoteRefs}
                    hadithId={data._id}
                  >
                    <Text className="text-lg text-center capitalize font-semibold text-royal-blue">
                      {data.volume_title.ms}
                    </Text>
                  </FootnotesMarker>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-[26px] text-center font-semibold text-royal-blue font-arabic-regular">
                    {data.volume_title.ar}
                  </Text>
                </View>
              </View>
              <FootnotesReference hadith={data} type={'volume_title.ms'} />
            </View>
          </View>
        </View>
      </Animated.View>
      <ReadingSettingsSheet bottomSheetRef={bottomSheetRef}/>
    </Page>
  )
}

export default UniversalDetail
