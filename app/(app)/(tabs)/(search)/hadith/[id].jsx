import React, { useRef } from 'react'
import { View, ActivityIndicator, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useGetHadith } from '../../../../shared/fetcher/useHadiths'
import Header from '../../../../components/header'
import HadithChapterTitle from '../../../../components/HadithChapterTitle'
import { shareHadith } from '../../../../utils/shareHadith'
import { toSuperscript } from '../../../../utils/toSuperscript'
import VolumeTitle from '../../../../components/VolumeTitle'
import HadithItem from '../../../../components/HadithItem'
import ActionButtons from '../../../../components/ActionButtons'

function HadithContent() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const footnoteRefs = useRef({})

  const { isLoading, data } = useGetHadith(id)

  const onSave = () => {
    // TODO: Implement save logic if needed
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <ScrollView>
      <Header
        title={data?.book_title?.ms}
        onPressButton={() => router.back()}
      />
      <View className="flex-1 p-4 pb-0 bg-white">
        <VolumeTitle volumeTitle={data?.volume_title} />
        <View className="flex-1">
          {data?.chapter_title?.ms && (
            <HadithChapterTitle 
              item={{
                chapter_title: data.chapter_title,
                chapter_transliteration: data.chapter_transliteration,
                chapter_metadata: data.chapter_metadata
              }}
              footnoteRefs={footnoteRefs}
            />
          )}
          <View className="space-y-8 bg-white mb-4 border border-royal-blue">
            <HadithItem hadith={data} footnoteRefs={footnoteRefs} />
            <ActionButtons 
              onShare={() => shareHadith(data)} 
              onSave={onSave} 
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HadithContent
