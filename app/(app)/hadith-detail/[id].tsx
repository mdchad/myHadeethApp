import React, { useRef, useEffect } from 'react'
import { View, ActivityIndicator, ScrollView, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
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
      <LoadingSpinner />
    )
  }

  return (
    <Page class="bg-white" edges={['bottom']}>
      <ScrollView className="bg-white" contentContainerStyle={{ flexGrow: 1 }}>
        {/*<Header*/}
        {/*  title={data?.book_title?.ms}*/}
        {/*  onPressButton={() => router.back()}*/}
        {/*/>*/}
        <View className="flex-1 pb-0 bg-white">
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
            <View className="space-y-8 bg-white mb-4">
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
