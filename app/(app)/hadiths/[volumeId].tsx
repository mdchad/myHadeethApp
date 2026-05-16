import React, { useRef, useState, useMemo, useEffect } from 'react'
import { View, Text, Keyboard, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import useGetHadiths from '@/app/shared/fetcher/useHadiths'
import { FlashList, FlashListRef } from '@shopify/flash-list'
import VolumeMetadataHeader from '@/app/components/volume-metadata-header'
import ChapterSection from '@/app/components/chapter-section'
import Page from '@/app/components/page'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUniwind } from 'uniwind'
import BottomSheet from '@gorhom/bottom-sheet'
import ReadingTopBar from '@/app/components/reading-top-bar'
import ReadingBottomBar from '@/app/components/reading-bottom-bar'
import ReadingSettingsSheet from '@/app/components/reading-settings'
import HadithSearchSheet from '@/app/components/hadith-search-sheet'
import { StatusBar } from 'expo-status-bar'
import { Skeleton } from 'moti/skeleton'
import Spacer from '@/app/components/spacer'
import { useReadingBottomBarStore } from '@/app/stores/useReadingBottomBarStore'
import type { Hadith, ChapterWithHadiths } from '@/app/types'

// Reading order (Book → Volume → Chapter → Hadith) is enforced by the API:
// chapters are returned ORDER BY number ASC, and hadiths inside each chapter are
// already in sort_order ASC. The client just renders what it receives.

// A hadith only renders if its first content block has Arabic text. Filter at this
// layer so search-match indices line up with what's actually on screen.
const hasRenderableContent = (h: Hadith) => !!h.content?.[0]?.ar

function HadithContent() {
  const { volumeId, bookId } = useLocalSearchParams<{ volumeId: string; bookId: string }>()
  const listRef = useRef<FlashListRef<ChapterWithHadiths>>(null)
  const router = useRouter()
  const footnoteRefs = useRef<Record<string, any>>({})
  const insets = useSafeAreaInsets()
  const { theme } = useUniwind()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const searchSheetRef = useRef<BottomSheet>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)

  const { isLoading, data } = useGetHadiths(bookId, volumeId)

  const { setVisible: setBottomBarVisible, setHeight: setBottomBarHeightStore } = useReadingBottomBarStore()

  const topBarTranslateY = useSharedValue(0)
  const bottomBarTranslateY = useSharedValue(0)
  const [barsVisible, setBarsVisible] = useState(true)
  const [bottomBarHeight, setBottomBarHeight] = useState(100)

  // API delivers chapters + hadiths in canonical order. We only filter out
  // hadiths that have no Arabic content (nothing to render). The result IS
  // the list data — each row is one chapter that renders its own hadiths.
  const chapters = useMemo<ChapterWithHadiths[]>(() => {
    if (!data?.chapters) return []
    return data.chapters.map((chapter) => ({
      ...chapter,
      hadiths: chapter.hadiths.filter(hasRenderableContent),
    }))
  }, [data])

  // Flattened in canonical order for the "play all" playlist.
  const allHadiths = useMemo<Hadith[]>(
    () => chapters.flatMap((c) => c.hadiths),
    [chapters]
  )

  // Search matches map to chapter indices: scrolling to the chapter brings the
  // matching hadith into view (one level above the hit, consistent with the hierarchy).
  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q || !chapters.length) return [] as number[]

    const matches: number[] = []
    chapters.forEach((chapter, index) => {
      const hit = chapter.hadiths.some((h) =>
        h.content?.some(
          (c) =>
            (c.ar?.toLowerCase().includes(q) ?? false) ||
            (c.ms?.toLowerCase().includes(q) ?? false)
        )
      )
      if (hit) matches.push(index)
    })
    return matches
  }, [searchQuery, chapters])

  useEffect(() => {
    setCurrentMatchIndex(0)
  }, [searchQuery])

  useEffect(() => {
    if (searchMatches.length > 0 && searchQuery.trim()) {
      listRef.current?.scrollToIndex({
        index: searchMatches[currentMatchIndex],
        animated: true,
        viewPosition: 0.1,
      })
    }
  }, [currentMatchIndex, searchMatches])

  const topBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topBarTranslateY.value }],
  }))

  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomBarTranslateY.value + 16 }],
  }))

  if (!data && !isLoading) {
    return <Text>Hadith not found</Text>
  }

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
  }

  const handleSearchPress = () => {
    searchSheetRef.current?.snapToIndex(1)
    hideBars()
  }

  const handleNextMatch = () => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length)
    }
  }

  const handlePreviousMatch = () => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) =>
        prev === 0 ? searchMatches.length - 1 : prev - 1
      )
    }
  }

  const handleCloseSearch = () => {
    setSearchQuery('')
    setCurrentMatchIndex(0)
    Keyboard.dismiss()
  }

  return (
    <Page className="bg-reading-background">
      <StatusBar hidden={!barsVisible} style={theme === 'dark' ? 'light' : 'dark'} />
      <ReadingTopBar
        animatedStyle={topBarAnimatedStyle}
        onBackPress={() => router.back()}
        onSearchPress={handleSearchPress}
        onSettingsPress={handlePresentModalPress}
      />
      <View className="pb-0 bg-reading-background">
        {isLoading ? (
          <ScrollView className="pt-40" showsVerticalScrollIndicator={false}>
            {/* Volume metadata — mirrors VolumeMetadataHeader (p-4 mb-2 outer, p-4 gap-2 inner). */}
            <View className="p-4 mb-2">
              <View className="p-4 gap-2">
                <View className="items-end mb-2">
                  <Skeleton colorMode="light" height={22} width="60%" />
                </View>
                <Skeleton colorMode="light" height={16} width="80%" />
              </View>
            </View>

            {[1, 2].map((index) => (
              <View key={index}>
                {/* Chapter title — mirrors ChapterTitle (mb-10 p-4 gap-4 outer, border-l-4 pl-2 inner). */}
                <View className="mb-10 p-4 gap-4">
                  <View className="gap-4 border-l-4 border-royal-blue-950 dark:border-royal-blue-700 pl-2">
                    <View className="gap-2 items-end">
                      <Skeleton colorMode="light" height={22} width="90%" />
                      <Skeleton colorMode="light" height={22} width="40%" />
                    </View>
                    <View className="gap-2">
                      <Skeleton colorMode="light" height={18} width="95%" />
                      <Skeleton colorMode="light" height={18} width="80%" />
                      <Skeleton colorMode="light" height={18} width="55%" />
                      <Spacer height={4} />
                      <Skeleton colorMode="light" height={14} width="85%" />
                      <Skeleton colorMode="light" height={14} width="60%" />
                    </View>
                  </View>
                </View>

                {/* Hadith content — mirrors HadithItem (px-4 py-6 gap-6). */}
                <View className="px-4 py-6 gap-6">
                  <View className="gap-3 items-end mb-2">
                    <Skeleton colorMode="light" height={22} width="100%" />
                    <Skeleton colorMode="light" height={22} width="95%" />
                    <Skeleton colorMode="light" height={22} width="100%" />
                    <Skeleton colorMode="light" height={22} width="90%" />
                    <Skeleton colorMode="light" height={22} width="100%" />
                    <Skeleton colorMode="light" height={22} width="70%" />
                  </View>
                  <View className="gap-2 pb-4">
                    <Skeleton colorMode="light" height={18} width="100%" />
                    <Skeleton colorMode="light" height={18} width="100%" />
                    <Skeleton colorMode="light" height={18} width="95%" />
                    <Skeleton colorMode="light" height={18} width="100%" />
                    <Skeleton colorMode="light" height={18} width="80%" />
                  </View>
                  <View className="flex flex-row gap-2">
                    <Skeleton colorMode="light" height={28} width={90} />
                    <Skeleton colorMode="light" height={28} width={80} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <>
            {chapters.length > 0 && (
              <View className="h-full">
                <FlashList
                  ref={listRef}
                  data={chapters}
                  renderItem={({ item: chapter }) => (
                    <ChapterSection
                      chapter={chapter}
                      footnoteRefs={footnoteRefs}
                      onContentPress={handleContentPress}
                    />
                  )}
                  ListHeaderComponent={
                    <VolumeMetadataHeader volume={data?.volume} />
                  }
                  keyExtractor={(chapter) => chapter.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="pt-40"
                />
              </View>
            )}

            <ReadingBottomBar
              animatedStyle={bottomBarAnimatedStyle}
              book={data?.book}
              volume={data?.volume}
              volumeFootnotes={data?.volume_footnotes}
              allHadiths={allHadiths}
              footnoteRefs={footnoteRefs}
              onLayout={handleBottomBarLayout}
              onHide={hideBars}
            />
          </>
        )}

        <ReadingSettingsSheet bottomSheetRef={bottomSheetRef} />
        <HadithSearchSheet
          bottomSheetRef={searchSheetRef}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentIndex={currentMatchIndex}
          totalMatches={searchMatches.length}
          onNext={handleNextMatch}
          onPrevious={handlePreviousMatch}
          onClose={handleCloseSearch}
        />
      </View>
    </Page>
  )
}

export default HadithContent
