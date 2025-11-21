import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  ImageBackground, StatusBar
} from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import Header from '@/app/components/header'
import useGetVolumes from '@/app/shared/fetcher/useVolumes'
import SHARED_TEXT from "@/app/i18n";
import {t} from "i18next";
import Page from '@/app/components/page'
import LoadingSpinner from '@/app/components/loading-spinner'

interface BilingualText {
  ms: string;
  ar: string;
}

interface VolumeItem {
  id: string | number;
  book_id: string;
  volume_id: string;
  title: BilingualText;
  transliteration?: BilingualText;
  hadith?: {
    first: number;
    last: number;
  };
}

interface HadithVolumeItemProps {
  item: VolumeItem;
  index: number;
}

const HadithVolumeItem: React.FC<HadithVolumeItemProps> = ({ item, index }) => (
  <Link
    asChild
    href={{
      pathname: `/(app)/(tabs)/(hadeeth)/hadiths/[volumeId]`,
      params: { volumeId: item.id, bookId: item.book_id },
    }}
  >
    <TouchableHighlight
      underlayColor="#f9fafb"
      style={{ marginVertical: 6, borderRadius: 10, overflow: 'hidden' }}
    >
      <View className="bg-white flex flex-row w-full">
        <View className="bg-black p-2 flex justify-center">
          <View className="bg-white">
            <ImageBackground
              source={require('@/assets/volume-number.png')}
              resizeMode="cover"
              style={{
                height: 35,
                width: 30,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text>{index}</Text>
            </ImageBackground>
          </View>
        </View>
        <View className="p-4 flex flex-col w-0 flex-grow justify-between space-y-4">
          <View className="flex flex-row justify-between">
            <View className="flex-1 mr-1">
              <Text className="text-royal-blue-950 text-[14px] flex-shrink capitalize mb-1">
                {item.title.ms}
              </Text>
              <Text className="text-xs text-gray-500 flex-shrink capitalize">
                {item?.transliteration?.ms}
              </Text>
            </View>
            <View className="flex-1 items-end ml-1">
              <Text
                className="text-royal-blue-950 text-[24px] text-right flex-shrink capitalize font-arabic-regular"
              >
                {item.title.ar}
              </Text>
            </View>
          </View>
          <View className="flex flex-row justify-between items-center mt-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-royal-blue-950 text-[12px]">
                {item?.hadith?.first}
              </Text>
              <Text className="text-royal-blue-950 text-[12px]">-</Text>
              <Text className="text-royal-blue-950 text-[12px]">
                {item?.hadith?.last}
              </Text>
            </View>
            <View className="flex flex-row items-center">
              <Text className="text-royal-blue-950 text-xs mr-1">
                {t(SHARED_TEXT.VIEW_MORE_LABEL)}
                {''} →
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  </Link>
)

function HadithVolume() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>()
  const router = useRouter()

  const { isLoading, isError, data, error } = useGetVolumes(id)

  if (isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <Page edges={['top']} className="bg-royal-blue-950">
      <StatusBar barStyle={'light-content'} />
      <Header title={title} onPressButton={() => router.back()} />
      <View className="bg-gray-100 pt-4 px-4 pb-20">
        <FlatList
          className="space-y-6"
          data={data}
          renderItem={({ item, index }) => (
            <HadithVolumeItem item={item} index={index + 1} />
          )}
          keyExtractor={(item) => item.id.toString()}
          style={{ paddingRight: 10, marginRight: -10 }}
        />
      </View>
    </Page>
  )
}

export default HadithVolume
