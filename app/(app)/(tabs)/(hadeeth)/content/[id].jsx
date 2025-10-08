import React, { useRef, useState } from 'react'
import { View } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Header from '../../../../components/header'
import { useGetHadiths } from '../../../../shared/fetcher/useHadiths'
import { FlashList } from '@shopify/flash-list'
import VolumeMetadataHeader from '../../../../components/VolumeMetadataHeader'
import HadithChapterTitle from '../../../../components/HadithChapterTitle'
import { shareHadith } from '../../../../utils/shareHadith'
import { toSuperscript } from '../../../../utils/toSuperscript'
import VolumeTitle from '../../../../components/VolumeTitle'
import HadithItem from '../../../../components/HadithItem'
import ActionButtons from '../../../../components/ActionButtons'
import LoadingSpinner from '../../../../components/LoadingSpinner'
import ScrollToTopButton from '../../../../components/ScrollToTopButton'

const HadithListItem = ({ item, onShare, onSave, ids }) => {
  const isNewChapter =
    ids.chapterId !== item.chapter_id || ids.firstHadithId === item._id

  return (
    <>
      {isNewChapter && (
        <HadithChapterTitle item={item} toSuperscript={toSuperscript} />
      )}
      {!item.content[0].ar ? null : (
        <View className="space-y-8 bg-white mb-4 border border-royal-blue">
          <HadithItem hadith={item} />
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
    <>
      <Header title={bookTitle} onPressButton={() => router.back()} />
      <View className="flex-1 p-4 pb-0 bg-white">
        <VolumeTitle volumeTitle={volumeTitle} />
        {data?.length > 0 && (
          <View className="flex-1">
            <FlashList
              ref={listRef}
              data={data}
              renderItem={({ item }) => (
                <HadithListItem
                  item={item}
                  onShare={shareHadith}
                  onSave={onSave}
                  ids={ids}
                />
              )}
              ListHeaderComponent={
                <VolumeMetadataHeader volumeDetails={data[0]?.volume_details} />
              }
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 6 }}
              estimatedItemSize={500}
            />
          </View>
        )}

        <ScrollToTopButton
          onPress={() =>
            listRef?.current?.scrollToOffset({ offset: 0, animated: true })
          }
        />
      </View>
    </>
  )
}

export default HadithContent
