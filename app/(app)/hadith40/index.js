import React from 'react'
import { View, Text } from 'react-native'
import Page from '@components/page'
import Header from '../../components/header'
import { useRouter } from 'expo-router'
import SHARED_TEXT from '../../i18n'
import {t} from "i18next";
import hadiths from '../../../data/hadith40.json'
import {FlashList} from "@shopify/flash-list";
import Audio from "../../components/audio";

export default function Hadith40() {
  const router = useRouter()

  function Items({ item }) {
    return (
      <View key={item.number} className="flex space-y-2 break-words p-4 border border-royal-blue mb-4">
        <View className="flex flex-row gap-2 items-center mb-6">
          <View className="flex items-center bg-royal-blue rounded-lg p-2 text-center">
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
                  <Text className="font-bold text-gray-700 text-2xl text-justify leading-10 mb-2" style={{ fontFamily: 'arabic_bold', writingDirection: 'rtl' }}>{cnt.ar}</Text>
                  <Text className="font-bold text-lg" style={{ fontFamily: 'arabic_regular' }}>{item.narratedBy[index].ar}</Text>
                  <Audio url={item.number === 5 && index === 1 ?  `${item.number}_content_ar`: uriAr } />
                </View>
                <View className="mt-4">
                  <Text className="text-lg mb-2 text-justify mb-2">{cnt.ms}</Text>
                  <Text className="text-xs text-right">{item.narratedBy[index].ms}</Text>
                  <Audio url={item.number === 5 && index === 1 ?  `${item.number}_content_ms`: uriMs } />
                </View>
              </View>
            )
          })
        }
        <View className="bg-royal-blue p-4">
          <Text className="text-white text-xl mb-2 font-semibold">Pengajaran</Text>
          {
            item.lesson.map((l, i) => {
              return (
                <View key={i}>
                  <Text className="text-white text-lg">{`\u2022 ${l.ms}`}</Text>
                </View>
              )
            })
          }
          <Audio url={`${item.number}_lesson`} />
        </View>
      </View>
    )
  }

  return (
    <Page>
      <Header
        title={t(SHARED_TEXT.HADITHS_FORTY_TITLE)}
        onPressButton={() => router.back()}
      />
      <View className="flex-1">
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