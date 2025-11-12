import React, { useRef, useEffect } from 'react'
import { View, ActivityIndicator, ScrollView, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useGetHadith } from '../../shared/fetcher/useHadiths'
import Header from '@/app/components/header'
import Page from "../../components/page"
import HadithChapterTitle from '@/app/components/hadith-chapter-title'
import { shareHadith } from '../../utils/shareHadith'
import VolumeTitle from '@/app/components/volume-title'
import HadithItem from '@/app/components/hadith-item'
import ActionButtons from '@/app/components/action-buttons'
import { usePostHog } from 'posthog-react-native'

function UniversalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const footnoteRefs = useRef<Record<string, any>>({})
  const posthog = usePostHog()

  const { isLoading, data, isError } = useGetHadith(id)

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <Page class="bg-white" edges={['bottom']}>
      <ScrollView className="bg-white" contentContainerStyle={{ flexGrow: 1 }}>
        <Header
          title={data?.book_title?.ms}
          onPressButton={() => router.back()}
        />
        <View className="flex-1 p-4 pb-0 bg-white">
          <VolumeTitle volumeTitle={data?.volume_title} footnoteRefs={footnoteRefs} hadiths={[data]}/>
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
              <HadithItem hadith={data} footnoteRefs={footnoteRefs}/>
              <ActionButtons
                onShare={() => shareHadith(data)}
                onSave={onSave}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Page>
  )
}

export default UniversalDetail
