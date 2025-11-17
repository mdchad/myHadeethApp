import React, { useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Header from '@/app/components/header'
import useGetHadiths from '@/app/shared/fetcher/useHadiths'
import { FlashList } from '@shopify/flash-list'
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
  const listRef = useRef<FlashList<HadithItemType>>(null)
  const [savedBookmark, setSavedBookmark] = useState<string[]>([])
  const router = useRouter()
  const ids = {
    chapterId: '',
    firstHadithId: ''
  }
  const footnoteRefs = useRef<Record<string, any>>({})
  const insets = useSafeAreaInsets()
  const fontSizeIndex = useReadingSettingsStore((state) => state.fontSizeIndex)
  const { theme } = useUniwind()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { isLoading, data } = useGetHadiths(bookId, volumeId)

  // Animation state for top and bottom bars
  const topBarTranslateY = useSharedValue(0)
  const bottomBarTranslateY = useSharedValue(0)
  const [barsVisible, setBarsVisible] = useState(true)
  const [bottomBarHeight, setBottomBarHeight] = useState(100)

  // Scroll tracking
  const lastScrollY = useRef(0)
  const scrollThreshold = 5 // Minimum scroll distance to trigger hide/show

  const onSave = (id: string) => {
    // TODO: Implement bookmark functionality
    setSavedBookmark((prev) => [...prev, id])
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const volumeTitle = data?.[0]?.volume_title
  const bookTitle = data?.[0]?.book_title?.ms

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
        onSettingsPress={handlePresentModalPress}
      />
      <View className="pb-0 bg-reading-background">
        {/*<VolumeTitle*/}
        {/*  volumeTitle={volumeTitle}*/}
        {/*  hadiths={data}*/}
        {/*  footnoteRefs={footnoteRefs}*/}
        {/*/>*/}
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
                />
              )}
              ListHeaderComponent={
                <VolumeMetadataHeader volumeDetails={data[0]?.volume_details} />
              }
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 6 }}
              // estimatedItemSize={500}
            />
          </View>
        )}

        {/* Sticky Bottom Bar */}
        <ReadingBottomBar
          animatedStyle={bottomBarAnimatedStyle}
          hadithData={data[0]}
          footnoteRefs={footnoteRefs}
          onLayout={setBottomBarHeight}
        />
        <ReadingSettingsSheet bottomSheetRef={bottomSheetRef}/>

        {/*<ScrollToTopButton*/}
        {/*  onPress={() =>*/}
        {/*    listRef?.current?.scrollToOffset({ offset: 0, animated: true })*/}
        {/*  }*/}
        {/*/>*/}
      </View>
    </Page>
  )
}

export default HadithContent
