import React, { useRef, useState, useMemo, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Header from '@/app/components/header'
import useGetHadiths from '@/app/shared/fetcher/useHadiths'
import { FlashList, FlashListRef } from '@shopify/flash-list'
import VolumeMetadataHeader from '@/app/components/volume-metadata-header'
import HadithChapterTitle from '@/app/components/hadith-chapter-title'
import shareHadith from '@/app/utils/shareHadith'
import VolumeTitle from '@/app/components/volume-title'
import HadithItem from '@/app/components/hadith-item'
import ActionButtons from '@/app/components/action-buttons'
import LoadingSpinner from '@/app/components/loading-spinner'
import ScrollToTopButton from '@/app/components/scroll-to-top-button'
import Page from '@/app/components/page'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useReadingSettingsStore } from '@/app/stores/useReadingSettingsStore'
import { useUniwind } from 'uniwind'
import BottomSheet from '@gorhom/bottom-sheet'
import ReadingTopBar from '@/app/components/reading-top-bar'
import ReadingBottomBar from '@/app/components/reading-bottom-bar'
import ReadingSettingsSheet from '@/app/components/reading-settings'
import HadithSearchSheet from '@/app/components/hadith-search-sheet'
import ChapterTitle from '@/app/components/chapter-title'
import { StatusBar } from 'expo-status-bar'

interface BilingualContent {
  ms?: string;
  ar?: string;
}

interface HadithItemType {
  _id: string;
  chapter_id: string;
  content: BilingualContent[];
  chapter_title?: BilingualContent;
  footnotes?: any[];
}

interface HadithListItemProps {
  item: HadithItemType;
  onShare: (item: HadithItemType) => void;
  onSave: (id: string) => void;
  ids: { chapterId: string; firstHadithId: string };
  footnoteRefs: React.RefObject<Record<string, any>>;
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

  // Animation state for top and bottom bars
  const topBarTranslateY = useSharedValue(0)
  const bottomBarTranslateY = useSharedValue(0)
  const [barsVisible, setBarsVisible] = useState(true)
  const [bottomBarHeight, setBottomBarHeight] = useState(100)

  // Scroll tracking
  const lastScrollY = useRef(0)
  const scrollThreshold = 5 // Minimum scroll distance to trigger hide/show

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
    transform: [{ translateY: bottomBarTranslateY.value }]
  }))

  const onSave = (id: string) => {
    // TODO: Implement bookmark functionality
    setSavedBookmark((prev) => [...prev, id])
  }

  if (isLoading) {
    return <LoadingSpinner />
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
  }

  const HadithListItem: React.FC<HadithListItemProps> = ({ item, onShare, onSave, ids, footnoteRefs }) => {
    const isNewChapter =
      ids.chapterId !== item.chapter_id || ids.firstHadithId === item._id

    return (
      <Pressable onPress={handleContentPress}>
        {isNewChapter && (
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
        {data?.length > 0 && (
          <View className="h-full">
            <FlashList
              ref={listRef}
              data={data}
              onScroll={handleScroll}
              renderItem={({ item }) => (
                <HadithListItem
                  item={item}
                  onShare={shareHadith}
                  onSave={onSave}
                  ids={ids}
                  footnoteRefs={footnoteRefs}
                />
              )}
              ListHeaderComponent={
                <VolumeMetadataHeader volumeDetails={data[0]?.volume_details} />
              }
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 6, paddingTop: 102 }}
            />
          </View>
        )}

        {/*<ScrollToTopButton*/}
        {/*  onPress={() =>*/}
        {/*    listRef?.current?.scrollToOffset({ offset: 0, animated: true })*/}
        {/*  }*/}
        {/*/>*/}

        {/* Sticky Bottom Bar */}
        <ReadingBottomBar
          animatedStyle={bottomBarAnimatedStyle}
          hadithData={data[0]}
          footnoteRefs={footnoteRefs}
          onLayout={setBottomBarHeight}
        />
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
