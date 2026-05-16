import React, { useRef, useState, useMemo, useEffect } from 'react'
import { View, Pressable, Text, Keyboard, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import useGetHadiths from '@/app/shared/fetcher/useHadiths'
import { FlashList, FlashListRef } from '@shopify/flash-list'
import VolumeMetadataHeader from '@/app/components/volume-metadata-header'
import shareHadith from '@/app/utils/shareHadith'
import HadithItem from '@/app/components/hadith-item'
import ActionButtons from '@/app/components/action-buttons'
import ScrollToTopButton from '@/app/components/scroll-to-top-button'
import Page from '@/app/components/page'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUniwind } from 'uniwind'
import BottomSheet from '@gorhom/bottom-sheet'
import ReadingTopBar from '@/app/components/reading-top-bar'
import ReadingBottomBar from '@/app/components/reading-bottom-bar'
import ReadingSettingsSheet from '@/app/components/reading-settings'
import HadithSearchSheet from '@/app/components/hadith-search-sheet'
import ChapterTitle from '@/app/components/chapter-title'
import { StatusBar } from 'expo-status-bar'
import { Skeleton } from 'moti/skeleton'
import Spacer from '@/app/components/spacer'
import { useReadingBottomBarStore } from '@/app/stores/useReadingBottomBarStore'

interface BilingualContent {
  ms?: string;
  ar?: string;
}

interface HadithItemType {
  _id: string;
  chapter_id: string;
  content: BilingualContent[];
  chapter_title?: BilingualContent;
  is_chapter_start: boolean;
  footnotes?: any[];
  number: number;
}

interface HadithListItemProps {
  item: HadithItemType;
  onShare: (item: HadithItemType) => void;
  onSave: (id: string) => void;
  handleContentPress: () => void;
  ids: { chapterId: string; firstHadithId: string };
  footnoteRefs: React.RefObject<Record<string, any>>;
}

const HadithListItem: React.FC<HadithListItemProps> = ({ item, onShare, onSave, ids, footnoteRefs, handleContentPress }) => {
  const showChapter = item.is_chapter_start;

  return (
    <Pressable onPress={handleContentPress}>
      {showChapter && (
        <ChapterTitle data={item} footnoteRefs={footnoteRefs}/>
      )}
      {!item.content[0].ar ? null : (
        <View className="space-y-8 bg-reading-background mb-4">
          <HadithItem hadith={item} footnoteRefs={footnoteRefs} />
          {/*<ActionButtons*/}
          {/*  onShare={() => onShare(item)}*/}
          {/*  onSave={() => onSave(item._id)}*/}
          {/*/>*/}
        </View>
      )}
    </Pressable>
  )
}

function HadithContent() {
  const { volumeId, bookId } = useLocalSearchParams<{ volumeId: string; bookId: string }>()
  const listRef = useRef<FlashListRef<HadithItemType>>(null)
  const [savedBookmark, setSavedBookmark] = useState<string[]>([])
  const router = useRouter()
  const ids = {
    chapterId: '',
    firstHadithId: ''
  }
  const footnoteRefs = useRef<Record<string, any>>({})
  const insets = useSafeAreaInsets()
  const { theme } = useUniwind()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const searchSheetRef = useRef<BottomSheet>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)

  const { isLoading, data } = useGetHadiths(bookId, volumeId)

  // Store for reading bottom bar
  const { setVisible: setBottomBarVisible, setHeight: setBottomBarHeightStore } = useReadingBottomBarStore()

  // Animation state for top and bottom bars
  const topBarTranslateY = useSharedValue(0)
  const bottomBarTranslateY = useSharedValue(0)
  const [barsVisible, setBarsVisible] = useState(true)
  const [bottomBarHeight, setBottomBarHeight] = useState(100)


  // Search logic - find all hadiths that contain the search query
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim() || !data) return []

    const matches: number[] = []
    const normalizedQuery = searchQuery.toLowerCase()

    data.forEach((hadith: any, index: any) => {
      // Search in Arabic and Malay content
      const hasMatch = hadith.content?.some((content: any) => {
        const arText = content.ar?.toLowerCase() || ''
        const msText = content.ms?.toLowerCase() || ''
        return arText.includes(normalizedQuery) || msText.includes(normalizedQuery)
      })

      if (hasMatch) {
        matches.push(index)
      }
    })

    return matches
  }, [searchQuery, data])

  // Reset current match index when search query changes
  useEffect(() => {
    setCurrentMatchIndex(0)
  }, [searchQuery])

  // Scroll to current match
  useEffect(() => {
    if (searchMatches.length > 0 && searchQuery.trim()) {
      const itemIndex = searchMatches[currentMatchIndex]
      listRef.current?.scrollToIndex({
        index: itemIndex,
        animated: true,
        viewPosition: 0.5 // Center the item in the view
      })
    }
  }, [currentMatchIndex, searchMatches])

  // Animated styles (MUST be called before early return)
  const topBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topBarTranslateY.value }]
  }))

  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomBarTranslateY.value + 16 }]
  }))

  const onSave = (id: string) => {
    // TODO: Implement bookmark functionality
    setSavedBookmark((prev) => [...prev, id])
  }

  if (!data && !isLoading) {
    return <Text>Hadith not found</Text>
  }

  // Show bars function
  const showBars = () => {
    topBarTranslateY.value = withTiming(0, { duration: 300 })
    bottomBarTranslateY.value = withTiming(0, { duration: 300 })
    setBarsVisible(true)
    setBottomBarVisible(true)
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
    setBottomBarVisible(false)
  }

  // Handle bottom bar layout
  const handleBottomBarLayout = (height: number) => {
    setBottomBarHeight(height)
    setBottomBarHeightStore(height)
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
      {/*<Header title={bookTitle} onPressButton={() => router.back()} />*/}
      <ReadingTopBar
        animatedStyle={topBarAnimatedStyle}
        onBackPress={() => router.back()}
        onSearchPress={handleSearchPress}
        onSettingsPress={handlePresentModalPress}
      />
      <View className="pb-0 bg-reading-background">
        {isLoading ? (
          <ScrollView className="pt-40" showsVerticalScrollIndicator={false}>
            {/* Volume Metadata Header Skeleton — matches VolumeMetadataHeader (p-4 mb-2 outer, p-4 gap-2 inner) */}
            <View className="p-4 mb-2">
              <View className="p-4 gap-2">
                <View className="items-end mb-2">
                  <Skeleton colorMode="light" height={22} width="60%" />
                </View>
                <Skeleton colorMode="light" height={16} width="80%" />
              </View>
            </View>

            {/* Hadith Items Skeleton */}
            {[1, 2].map((index) => (
              <View key={index}>
                {/* Chapter Title Skeleton — matches ChapterTitle (mb-10 p-4 gap-4 outer, border-l-4 pl-2 gap-4 inner) */}
                <View className="mb-10 p-4 gap-4">
                  <View className="gap-4 border-l-4 border-royal-blue-950 dark:border-royal-blue-700 pl-2">
                    {/* Arabic chapter title (RTL, 2 lines) */}
                    <View className="gap-2 items-end">
                      <Skeleton colorMode="light" height={22} width="90%" />
                      <Skeleton colorMode="light" height={22} width="40%" />
                    </View>
                    {/* Malay bold title */}
                    <View className="gap-2">
                      <Skeleton colorMode="light" height={18} width="95%" />
                      <Skeleton colorMode="light" height={18} width="80%" />
                      <Skeleton colorMode="light" height={18} width="55%" />
                      {/* Transliteration */}
                      <Spacer height={4} />
                      <Skeleton colorMode="light" height={14} width="85%" />
                      <Skeleton colorMode="light" height={14} width="60%" />
                    </View>
                  </View>
                </View>

                {/* Hadith Content Skeleton — matches HadithItem (px-4 py-6 gap-6) */}
                <View className="px-4 py-6 gap-6">
                  {/* Arabic content (RTL, multiple lines) */}
                  <View className="gap-3 items-end mb-2">
                    <Skeleton colorMode="light" height={22} width="100%" />
                    <Skeleton colorMode="light" height={22} width="95%" />
                    <Skeleton colorMode="light" height={22} width="100%" />
                    <Skeleton colorMode="light" height={22} width="90%" />
                    <Skeleton colorMode="light" height={22} width="100%" />
                    <Skeleton colorMode="light" height={22} width="70%" />
                  </View>
                  {/* Malay translation */}
                  <View className="gap-2 pb-4">
                    <Skeleton colorMode="light" height={18} width="100%" />
                    <Skeleton colorMode="light" height={18} width="100%" />
                    <Skeleton colorMode="light" height={18} width="95%" />
                    <Skeleton colorMode="light" height={18} width="100%" />
                    <Skeleton colorMode="light" height={18} width="80%" />
                  </View>
                  {/* Action buttons */}
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
            {data?.length > 0 && (
              <View className="h-full">
                <FlashList
                  ref={listRef}
                  data={data}
                  renderItem={({ item }) => (
                    <HadithListItem
                      item={item}
                      onShare={shareHadith}
                      onSave={onSave}
                      ids={ids}
                      footnoteRefs={footnoteRefs}
                      handleContentPress={handleContentPress}
                    />
                  )}
                  ListHeaderComponent={
                    <VolumeMetadataHeader volumeDetails={data[0]?.volume_details} />
                  }
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="pt-40"
                />
              </View>
            )}

            {/* Sticky Bottom Bar */}
            <ReadingBottomBar
              animatedStyle={bottomBarAnimatedStyle}
              hadithData={data[0]}
              allHadiths={data}
              footnoteRefs={footnoteRefs}
              onLayout={handleBottomBarLayout}
              onHide={hideBars}
            />
          </>
        )}

        <ReadingSettingsSheet bottomSheetRef={bottomSheetRef}/>
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
