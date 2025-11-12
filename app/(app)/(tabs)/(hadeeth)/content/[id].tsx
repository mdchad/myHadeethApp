import React, { useRef, useState } from 'react'
import { View } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Header from '@/app/components/header'
import { useGetHadiths } from '@/app/shared/fetcher/useHadiths'
import { FlashList } from '@shopify/flash-list'
import VolumeMetadataHeader from '@/app/components/volume-metadata-header'
import HadithChapterTitle from '@/app/components/hadith-chapter-title'
import { shareHadith } from '@/app/utils/shareHadith'
import VolumeTitle from '@/app/components/volume-title'
import HadithItem from '@/app/components/hadith-item'
import ActionButtons from '@/app/components/action-buttons'
import LoadingSpinner from '@/app/components/loading-spinner'
import ScrollToTopButton from '@/app/components/scroll-to-top-button'
import Page from '@/app/components/page'

const HadithListItem = ({ item, onShare, onSave, ids, footnoteRefs }) => {
  const isNewChapter =
    ids.chapterId !== item.chapter_id || ids.firstHadithId === item._id

  return (
    <>
      {isNewChapter && (
        <HadithChapterTitle item={item} footnoteRefs={footnoteRefs} />
      )}
      {!item.content[0].ar ? null : (
        <View className="space-y-8 bg-white mb-4 border border-royal-blue">
          <HadithItem hadith={item} footnoteRefs={footnoteRefs} />
          <ActionButtons
            onShare={() => onShare(item)}
            onSave={() => onSave(item._id)}
          />
        </View>
      )}
    </>
  )
}

function HadithContent() {
  const { volumeId, bookId } = useLocalSearchParams()
  const listRef = useRef(null)
  const [savedBookmark, setSavedBookmark] = useState([])
  const router = useRouter()
  const ids = {
    chapterId: '',
    firstHadithId: ''
  }
  const footnoteRefs = useRef({})

  const { isLoading, data } = useGetHadiths(bookId, volumeId)

  const onSave = (id) => {
    // TODO: Implement bookmark functionality
    setSavedBookmark((prev) => [...prev, id])
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const volumeTitle = data?.[0]?.volume_title
  const bookTitle = data?.[0]?.book_title?.ms

  return (
    <Page>
      <Header title={bookTitle} onPressButton={() => router.back()} />
      <View className="p-4 pb-0 bg-white">
        <VolumeTitle
          volumeTitle={volumeTitle}
          hadiths={data}
          footnoteRefs={footnoteRefs}
        />
        {data?.length > 0 && (
          <View className=" h-full">
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

        <ScrollToTopButton
          onPress={() =>
            listRef?.current?.scrollToOffset({ offset: 0, animated: true })
          }
        />
      </View>
    </Page>
  )
}

export default HadithContent
