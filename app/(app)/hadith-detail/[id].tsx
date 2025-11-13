import React, { useRef, useEffect, useState } from 'react'
import { View, ActivityIndicator, ScrollView, Text, Pressable, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGetHadith } from '../../shared/fetcher/useHadiths'
import Header from '@/app/components/header'
import Page from "../../components/page"
import HadithChapterTitle from '@/app/components/hadith-chapter-title'
import shareHadith from '../../utils/shareHadith'
import VolumeTitle from '@/app/components/volume-title'
import HadithItem from '@/app/components/hadith-item'
import ActionButtons from '@/app/components/action-buttons'
import { usePostHog } from 'posthog-react-native'
import LoadingSpinner from '@/app/components/loading-spinner'
import FootnotesMarker from '@/app/components/footnotes-marker'
import FootnotesReference from '@/app/components/footnotes-reference'
import QuranText from '@/app/components/quran-text'
import SpecialText from '@/app/components/special-text'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

function UniversalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const footnoteRefs = useRef<Record<string, any>>({})
  const posthog = usePostHog()
  const insets = useSafeAreaInsets()

  const { isLoading, data, isError } = useGetHadith(id)

  // Animation state for top and bottom bars
  const topBarTranslateY = useSharedValue(0)
  const bottomBarTranslateY = useSharedValue(0)
  const [barsVisible, setBarsVisible] = useState(true)

  // Scroll tracking
  const lastScrollY = useRef(0)
  const scrollThreshold = 5 // Minimum scroll distance to trigger hide/show

  useEffect(() => {
    if (data) {
      posthog.capture('hadith_viewed', {
        hadith_id: data._id,
        book: data.book_title?.ms,
        volume: data.volume_title?.ms,
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
    // Hide bottom bar below the safe area
    bottomBarTranslateY.value = withTiming(100 + insets.bottom, { duration: 300 })
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

  // Animated styles
  const topBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topBarTranslateY.value }],
  }))

  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomBarTranslateY.value }],
  }))

  if (isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <Page class="bg-white" edges={['bottom']}>
      {/* Sticky Top Bar */}
      <Animated.View
        style={[topBarAnimatedStyle]}
        className="absolute top-0 left-0 right-0 z-50 bg-white shadow-md"
      >
        <View style={{ paddingTop: insets.top }}>
          <Header
            title={data?.book_title?.ms}
            onPressButton={() => router.back()}
          />
        </View>
      </Animated.View>

      <ScrollView
        className="bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Pressable onPress={handleContentPress}>
          <View className="flex-1 pb-0 bg-white pt-16">
          {/*<VolumeTitle volumeTitle={data?.volume_title} footnoteRefs={footnoteRefs} hadiths={[data]}/>*/}
          <View className="pb-2 mb-3 mt-10">
            <View className="flex items-center">
              <View className="flex-1">
                <FootnotesMarker
                  footnotes={data.footnotes}
                  type={"volume_title.ms"}
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
                <Text
                  className="text-[26px] text-center font-semibold text-royal-blue font-arabic-regular"
                >
                  {data.volume_title.ar}
                </Text>
              </View>
            </View>
            <FootnotesReference hadith={data} type={"volume_title.ms"} />
          </View>
          <View className="flex-1">
            {data?.chapter_title?.ms && (
              <View className="mt-20 mb-10 p-4 gap-10">
                <View className="gap-4">
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
                  <View className="gap-4">
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
                    <FootnotesReference hadith={data} type={'chapter_title.ms'} />
                    <FootnotesReference hadith={data} type={'chapter_metadata.ms'} />
                  </View>
                )}
              </View>
            )}
            <View className="space-y-8 bg-white mb-20">
              <HadithItem hadith={data} footnoteRefs={footnoteRefs}/>
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
        <ActionButtons
          onShare={() => shareHadith(data)}
          onSave={onSave}
        />
        <View style={{ paddingBottom: insets.bottom }} className="bg-royal-blue" />
      </Animated.View>
    </Page>
  )
}

export default UniversalDetail
