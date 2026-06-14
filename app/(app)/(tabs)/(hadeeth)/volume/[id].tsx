import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TextInput,
  ImageBackground,
  StatusBar,
} from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useFuzzySearchList } from '@nozbe/microfuzz/react'
import { Search } from 'lucide-react-native'
import Header from '@/app/components/header'
import useGetVolumes from '@/app/shared/fetcher/useVolumes'
import SHARED_TEXT from '@/app/i18n'
import { t } from 'i18next'
import Page from '@/app/components/page'
import LoadingSpinner from '@/app/components/loading-spinner'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import type { Volume } from '@/app/types'

interface HadithVolumeItemProps {
  item: Volume;
  index: number;
  // When the user filtered by hadith number, pass it through so the hadiths
  // page can scroll to the chapter containing that hadith on mount.
  targetHadith?: number;
}

const HadithVolumeItem: React.FC<HadithVolumeItemProps> = ({ item, index, targetHadith }) => (
  <Link
    asChild
    href={{
      pathname: `/(app)/hadiths/[volumeId]`,
      params: {
        volumeId: item.id,
        bookId: item.book_id,
        ...(targetHadith ? { hadith: String(targetHadith) } : {}),
      },
    }}
  >
    <TouchableHighlight
      testID={`volume-${item.number}`}
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
                alignItems: 'center',
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
                {item.title_ms}
              </Text>
              {!!item.transliteration_ms && (
                <Text className="text-xs text-gray-500 flex-shrink capitalize">
                  {item.transliteration_ms}
                </Text>
              )}
            </View>
            <View className="flex-1 items-end ml-1">
              <Text className="text-royal-blue-950 text-[24px] text-right flex-shrink capitalize font-arabic-regular">
                {item.title_ar}
              </Text>
            </View>
          </View>
          <View className="flex flex-row justify-between items-center mt-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-royal-blue-950 text-[12px]">
                {item.hadith_first}
              </Text>
              <Text className="text-royal-blue-950 text-[12px]">→</Text>
              <Text className="text-royal-blue-950 text-[12px]">
                {item.hadith_last}
              </Text>
            </View>
            <View className="flex flex-row items-center">
              <Text className="text-royal-blue-950 text-xs mr-1">
                {t(SHARED_TEXT.VIEW_MORE_LABEL)}
                {''} ↗
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
  const bottomTabBarHeight = useBottomTabBarHeight()
  const [q, setQ] = useState('')

  const { isLoading, data } = useGetVolumes(id)

  // Dual-mode filter (mirrors web's VolumeContainer):
  //   numeric → match by hadith_first/last range OR extra_numbers (cross-refs)
  //   text    → fuzzy match on title_ms
  const parsedNumber = parseInt(q, 10)
  const queryNumber = !isNaN(parsedNumber) && parsedNumber > 0 ? parsedNumber : 0
  const queryText = queryNumber > 0 ? '' : q.trim()

  const numberFilteredList = useMemo<Volume[]>(() => {
    if (!data) return []
    if (queryNumber === 0) return data
    return data.filter(
      (v) =>
        (v.hadith_first != null &&
          v.hadith_last != null &&
          queryNumber >= v.hadith_first &&
          queryNumber <= v.hadith_last) ||
        v.extra_numbers?.includes(queryNumber)
    )
  }, [data, queryNumber])

  const filteredList = useFuzzySearchList({
    list: numberFilteredList,
    queryText,
    getText: (item) => [item.title_ms],
    mapResultItem: ({ item }) => item,
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Page edges={['top']} className="bg-royal-blue-950">
      <StatusBar barStyle={'light-content'} />
      <Header title={title} onPressButton={() => router.back()} />
      <View className="bg-gray-100 pt-4 px-4 flex-1">
        <View className="relative mb-3">
          <Search
            size={16}
            color="#9ca3af"
            style={{ position: 'absolute', left: 12, top: 14, zIndex: 1 }}
          />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Cari kitab atau nombor hadis"
            placeholderTextColor="#9ca3af"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
            className="bg-white border border-gray-300 rounded-md h-11 pl-9 pr-3 text-base text-royal-blue-950"
          />
        </View>

        {filteredList.length === 0 ? (
          <View className="bg-white border border-gray-300 p-10 items-center">
            <Text className="text-lg text-royal-blue-950">Kitab tidak dijumpai</Text>
          </View>
        ) : (
          <FlatList
            className="space-y-6"
            data={filteredList}
            renderItem={({ item, index }) => (
              <HadithVolumeItem
                item={item}
                index={index + 1}
                targetHadith={queryNumber || undefined}
              />
            )}
            keyExtractor={(item) => item.id}
            style={{ paddingRight: 10, marginRight: -10 }}
            contentContainerStyle={{ paddingBottom: bottomTabBarHeight }}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </Page>
  )
}

export default HadithVolume
