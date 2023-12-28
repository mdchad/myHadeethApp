import React from 'react'
import { View, Text } from 'react-native'
import Page from '@components/page'
import Header from '../../components/header'
import { useRouter } from 'expo-router'
import Pdf from 'react-native-pdf'
import SHARED_TEXT from '../../i18n'
import {t} from "i18next";
import hadiths from '../../../data/hadith40.json'
import {FlashList} from "@shopify/flash-list";

export default function Hadith40() {
  // const yourPdfURL = 'https://my-way-web.vercel.app/hadis40.pdf'
  const router = useRouter()

  function Items({ item }) {
    return (
      <View key={item.number} className="p-4 border border-royal-blue mb-4">
        <Text className="text-xl">HADIS {item.number}</Text>
        <Text className="text-xl">{item.hadith_title.ms}</Text>
        {
          item.content.map((cnt, index) => {
            // console.log(index)
            // console.log(item.narrators[index])
            return (
              <View key={index}>
                <Text>{item.narrators[index].ms}</Text>
                <View>
                  <Text className="font-bold text-2xl text-right" style={{ fontFamily: 'Traditional_ArabicRegular' }}>{cnt.ar}</Text>
                  <Text className="font-bold text-lg" style={{ fontFamily: 'Traditional_ArabicRegular' }}>{item.narratedBy[index].ar}</Text>
                </View>
                <View>
                  <Text className="font-semibold">{cnt.ms}</Text>
                  <Text className="text-xs">{item.narratedBy[index].ms}</Text>
                </View>
              </View>
            )
          })
        }
        <View>
          <Text className="text-xl">Pengajaran</Text>
          {
            item.lesson.map((l, i) => {
              return (
                <View key={i}>
                  <Text>{`\u2022 ${l.ms}`}</Text>
                </View>
              )
            })
          }
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