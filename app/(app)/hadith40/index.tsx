import React from 'react'
import { View, Text, StatusBar } from 'react-native'
import Page from '@/app/components/page'
import Header from '@/app/components/header'
import { useRouter } from 'expo-router'
import SHARED_TEXT from '../../i18n'
import {t} from "i18next";
import hadiths from '@/data/hadith40.json'
import {FlashList} from "@shopify/flash-list";
import Audio from "@/app/components/audio";

interface BilingualText {
  ms: string;
  ar: string;
}

interface HadithContent {
  ms: string;
  ar: string;
  audio: BilingualText;
}

interface Lesson {
  items: BilingualText[];
  audio: BilingualText;
}

interface Hadith40Item {
  number: number;
  hadith_title: BilingualText;
  content: HadithContent[];
  narrators: BilingualText[];
  narratedBy: BilingualText[];
  lesson: Lesson;
  references?: any[];
}

interface ItemsProps {
  item: Hadith40Item;
}

export default function Hadith40() {
  const router = useRouter()

  function Items({ item }: ItemsProps) {
    return (
      <View key={item.number} className="flex space-y-2 break-words p-4 border border-royal-blue-950 mb-4">
        <View className="flex flex-row gap-2 items-center mb-6">
          <View className="flex items-center bg-royal-blue-950 rounded-lg p-2 text-center">
            <Text className="text-white text-xl">Hadis</Text>
            <Text className="text-white text-xl">{item.number}</Text>
          </View>
          <View className="flex-shrink">
            <Text className="text-2xl">{item.hadith_title.ms}</Text>
          </View>
        </View>
        {
          item.content.map((cnt, index, arr) => {
            const uriAr = arr.length > 1 ? `${item.number}_content_ar_${index + 1}` : `${item.number}_content_ar`
            const uriMs = arr.length > 1 ? `${item.number}_content_ms_${index + 1}` : `${item.number}_content_ms`
            return (
              <View key={index} className="mb-4">
                <Text className="mb-4">{item.narrators[index].ms}</Text>
                <View className="bg-gray-200 rounded-md px-2 py-4">
                  <Text className="font-bold text-gray-700 text-2xl text-justify leading-10 mb-2 font-arabic-bold" style={{ writingDirection: 'rtl' }}>{cnt.ar}</Text>
                  <Text className="font-bold text-lg font-arabic-regular">{item.narratedBy[index].ar}</Text>
                  <Audio url={item.number === 5 && index === 1 ?  `${item.number}_content_ar`: uriAr } />
                </View>
                <View className="mt-4">
                  <Text className="text-lg mb-2 text-justify mb-2">{cnt.ms}</Text>
                  <Text className="text-xs text-right">{item.narratedBy[index].ms}</Text>
                  <Audio url={cnt.audio.ms} />
                </View>
              </View>
            )
          })
        }
        <View className="bg-royal-blue-950 p-4">
          <Text className="text-white text-xl mb-2 font-semibold">Pengajaran</Text>
          {
            item.lesson.items.map((l, i) => {
              return (
                <View key={i}>
                  <Text className="text-white text-lg">{`\u2022 ${l.ms}`}</Text>
                </View>
              )
            })
          }
          <Audio url={`${item.lesson.audio.ms}`} />
        </View>
      </View>
    )
  }

  return (
    <Page edges={['top']} className="bg-royal-blue-950">
      <StatusBar barStyle="light-content" />
      <Header
        title={t(SHARED_TEXT.HADITHS_FORTY_TITLE)}
        onPressButton={() => router.back()}
      />
      <View className="bg-gray-100 h-full">
        <FlashList
          data={hadiths}
          renderItem={Items}
          contentContainerStyle={{ paddingHorizontal: 6, paddingVertical: 6 }}
          // style={{ paddingRight: 5, marginRight: -10 }}
          estimatedItemSize={42}
        />
      </View>
    </Page>
  )
}