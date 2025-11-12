import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Pressable,
  StyleSheet
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Page from '@/app/components/page'
import {
  Bookmark,
  ChevronRightSquare,
  Heart,
  SettingsIcon,
  Share2
} from 'lucide-react-native'
import { useGetTodayHadith } from '@/app/shared/fetcher/useTodayHadith'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { Skeleton } from 'moti/skeleton'
import Spacer from '@/app/components/spacer'
import SHARED_TEXT from '../../../i18n'
import RNPickerSelect from 'react-native-picker-select'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { capitalize } from 'es-toolkit'
import { usePostHog } from 'posthog-react-native'

function Home() {
  const { isLoading, isError, data, error } = useGetTodayHadith()
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language)
  const posthog = usePostHog()

  useEffect(() => {
    posthog.capture("home_viewed")
  }, [])

  return (
    <Page class="bg-white">
      <View className="flex space-y-3 bg-white">
        <ScrollView>
          <View className="mx-2 p-3 flex gap-4">
            <View className="gap-5">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-3xl text-royal-blue font-bold leading-none">
                  {t(SHARED_TEXT.HOME_HEADER)}
                </Text>
                <View className="flex flex-row items-center">
                  <RNPickerSelect
                    onValueChange={async (value) => {
                      if (value !== null) {
                        setLang(value)
                        await AsyncStorage.setItem('user-language', value)
                        i18n.changeLanguage(value)
                      }
                    }}
                    value={lang}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{}}
                    style={pickerSelectStyles}
                    items={[
                      {
                        label: '🇲🇾 Bahasa Malaysia',
                        value: 'ms',
                        inputLabel: '🇲🇾'
                      },
                      { label: '🇬🇧 English', value: 'en', inputLabel: '🇬🇧' }
                    ]}
                  />
                  <Link href="/user" asChild>
                    <Pressable className="ml-2">
                      <SettingsIcon size={20} color={'#1C2A4F'} />
                    </Pressable>
                  </Link>
                </View>
              </View>
              <Link
                href={{ pathname: `/hadith-detail/${data?._id}` }}
                asChild
              >
                <Pressable className="bg-white border border-1 border-royal-blue gap-2 rounded-md overflow-hidden">
                  {data ? (
                    <View className="p-6">
                      <View className="flex flex-row flex-wrap mb-4">
                        <Text className="font-mono font-semibold text-sm text-[#f80]">
                          [ {data?.book_title?.ms}
                          {' '}/{' '}
                          {capitalize(data?.volume_title?.ms)} ]
                        </Text>
                      </View>
                      {/*<Text*/}
                      {/*  numberOfLines={7}*/}
                      {/*  className="text-xl mb-1 pb-4 leading-8 font-arabic-regular"*/}
                      {/*  lang="ar"*/}
                      {/*  style={{ writingDirection: 'rtl' }}*/}
                      {/*>*/}
                      {/*  {data?.content[0].ar}*/}
                      {/*</Text>*/}
                      <Text
                        numberOfLines={7}
                        ellipsizeMode="tail"
                        className="font-arabic-symbols"
                      >
                        {data?.content[0].ms}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                      <Spacer height={10} />
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                      <Spacer height={10} />
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                      <Spacer height={10} />
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                      <Spacer height={10} />
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                      <Spacer height={10} />
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                      <Spacer height={10} />
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                      <Spacer height={10} />
                      <Skeleton
                        colorMode={'light'}
                        height={20}
                        width={'100%'}
                      />
                    </>
                  )}
                  <View className="flex flex-row justify-between items-center bg-royal-blue">
                    <View className="flex flex-row items-center">
                      <TouchableHighlight className="p-1" underlayColor="#333">
                        <Share2
                          color="white"
                          absoluteStrokeWidth={2}
                          size={18}
                        />
                      </TouchableHighlight>
                      {/*<TouchableHighlight className="p-1" underlayColor="#333">*/}
                      {/*  <Heart*/}
                      {/*    color="white"*/}
                      {/*    absoluteStrokeWidth={2}*/}
                      {/*    size={16}*/}
                      {/*  />*/}
                      {/*</TouchableHighlight>*/}
                      <TouchableHighlight className="p-1" underlayColor="#333">
                        <Bookmark
                          color="white"
                          absoluteStrokeWidth={2}
                          size={18}
                        />
                      </TouchableHighlight>
                    </View>
                    <View className="flex flex-row items-center p-2">
                      <Text className="text-white">
                        {t(SHARED_TEXT.VIEW_MORE_LABEL)}
                        {''} →
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            </View>

            <View className="flex flex-row gap-2">
              <Link href="/hadith40" asChild className="flex-1">
                <Pressable className="border border-royal-blue flex justify-between items-center rounded-md">
                  <View className="flex-grow p-8 w-full">
                    <Text className="text-lg text-royal-blue font-semibold">
                      {t(SHARED_TEXT.HOME_FORTY_HADITHS_TITLE)}
                    </Text>
                    <Text className="text-xs text-royal-blue break-words">
                      {t(SHARED_TEXT.HOME_FORTY_HADITHS_DESC)}
                    </Text>
                  </View>
                  <View className="h-[16px] bg-royal-blue w-full"></View>
                </Pressable>
              </Link>
              <Link href={'(tabs)/(hadeeth)'} asChild className="flex-1">
                <Pressable className="border border-royal-blue rounded-md">
                  <LinearGradient
                    // Background Linear Gradient
                    colors={['#22276E', '#008080']}
                    className="flex justify-between items-stretch"
                  >
                    <View className="flex-grow p-8 w-full font-semibold">
                      <Text className="text-white text-lg">
                        {t(SHARED_TEXT.HOME_SIX_BOOKS_TITLE)}
                      </Text>
                      <Text className="text-white text-xs break-words">
                        {t(SHARED_TEXT.HOME_SIX_BOOKS_DESC)}
                      </Text>
                    </View>
                    <View className="h-[16px] bg-royal-blue w-full"></View>
                  </LinearGradient>
                </Pressable>
              </Link>
            </View>

            <Link href="/introduction" asChild>
              <Pressable className="bg-white border border-1 border-royal-blue space-y-3 rounded-md">
                <View className="p-3">
                  <Text className="font-semibold text-lg text-royal-blue underline mb-2">
                    {t(SHARED_TEXT.HOME_INTRO_TITLE)}
                  </Text>
                  <Text className="text-royal-blue">
                    {t(SHARED_TEXT.HOME_INTRO_DESC)}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center bg-royal-blue">
                  <View className="flex flex-row items-center">
                  </View>
                  <View className="flex flex-row items-center p-2">
                    <Text className="text-white">
                      {t(SHARED_TEXT.VIEW_MORE_LABEL)}
                      {''} →
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </View>
    </Page>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgb(243, 244, 246)',
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'rgb(243, 244, 246)'
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgb(243, 244, 246)',
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'rgb(243, 244, 246)'
  }
})

export default Home
