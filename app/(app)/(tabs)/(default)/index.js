import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Pressable,
  StyleSheet
} from 'react-native'
import React, {useEffect, useState} from 'react'
import Page from '@components/page'
import {
  ArrowRight,
  Bookmark,
  ChevronRightSquare,
  Heart, SettingsIcon,
  Share2
} from 'lucide-react-native'
import { useGetTodayHadith } from '../../../shared/fetcher/useTodayHadith'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import {Skeleton} from "moti/skeleton";
import Spacer from "../../../components/Spacer";
import SHARED_TEXT from "../../../i18n";
import RNPickerSelect from 'react-native-picker-select';
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Home() {
  const { isLoading, isError, data, error } = useGetTodayHadith()
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language)

  return (
    <Page class="bg-white">
      <View className="flex-1 flex space-y-3 bg-white">
        <ScrollView>
          <View className="mx-2 p-3 flex space-y-6">
            <View className="space-y-5">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-3xl text-royal-blue font-bold leading-none tracking-tight">
                  {t(SHARED_TEXT.HOME_HEADER)}
                </Text>
                <View className="flex flex-row items-center">
                  <RNPickerSelect
                    onValueChange={async (value) => {
                      if (value !== null) {
                        setLang(value)
                        await AsyncStorage.setItem('user-language', value);
                        i18n.changeLanguage(value)
                      }
                    }}
                    value={lang}
                    placeholder={{}}
                    style={pickerSelectStyles}
                    items={[
                      { label: '🇲🇾 Bahasa Malaysia', value: 'ms', inputLabel: '🇲🇾' },
                      { label: '🇬🇧 English', value: 'en', inputLabel: '🇬🇧' }
                    ]}
                  />
                  <Link href="/user" asChild>
                    <Pressable className="ml-2">
                      <SettingsIcon size={20} color={'#1C2A4F'}/>
                      {/* <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} /> */}
                    </Pressable>
                  </Link>
                </View>
              </View>
              <Link
                href={{ pathname: `/(search)/hadith/${data?._id}` }}
                asChild
              >
                <Pressable className="bg-white border border-1 border-royal-blue space-y-3 rounded-md">
                {data ? (
                  <View className="p-3">
                    <View className="flex flex-row flex-wrap mb-4">
                      <Text className="font-bold text-royal-blue mr-2">
                        {data?.book_title.ms}
                      </Text>
                      <ChevronRightSquare color="black" size={16} className={'mr-2'} />
                      <Text className="font-bold text-royal-blue">
                        {data?.volume_title.ms}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={7}
                      ellipsizeMode="tail"
                      className="mb-1 text-xl"
                      style={{ fontFamily: 'Traditional_ArabicRegular' }}
                    >
                      {data?.content[0].ar}
                    </Text>
                    <Text
                      numberOfLines={7}
                      ellipsizeMode="tail"
                      style={{ fontFamily: 'KFGQPC_Regular' }}
                    >
                      {data?.content[0].ms}
                    </Text>
                  </View>
                  ) : (
                    <>
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                      <Spacer height={10} />
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                      <Spacer height={10} />
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                      <Spacer height={10} />
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                      <Spacer height={10} />
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                      <Spacer height={10} />
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                      <Spacer height={10} />
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                      <Spacer height={10} />
                      <Skeleton colorMode={'light'} height={20} width={'100%'} />
                    </>
                  )}
                  <View className="flex flex-row justify-between items-center bg-royal-blue">
                    <View className="flex flex-row items-center">
                      <TouchableHighlight className="p-1" underlayColor="#333">
                        <Share2
                          color="white"
                          absoluteStrokeWidth={2}
                          size={16}
                        />
                      </TouchableHighlight>
                      <TouchableHighlight className="p-1" underlayColor="#333">
                        <Heart
                          color="white"
                          absoluteStrokeWidth={2}
                          size={16}
                        />
                      </TouchableHighlight>
                      <TouchableHighlight className="p-1" underlayColor="#333">
                        <Bookmark
                          color="white"
                          absoluteStrokeWidth={2}
                          size={16}
                        />
                      </TouchableHighlight>
                    </View>
                    <View className="flex flex-row items-center space-x-2">
                      <Text className="text-white">{t(SHARED_TEXT.VIEW_MORE_LABEL)}</Text>
                      <ArrowRight size={18} color={'white'} />
                    </View>
                  </View>
                </Pressable>
              </Link>
            </View>

            <View className="flex flex-row space-x-2">
              <Link href="/hadith40" asChild>
                <Pressable className="border border-royal-blue flex flex-1 justify-between items-center rounded-md">
                  <View className="flex-grow p-2 w-full">
                    <Text className="text-lg text-royal-blue">
                      {t(SHARED_TEXT.HOME_FORTY_HADITHS_TITLE)}
                    </Text>
                    <Text className="text-xs text-royal-blue break-words">
                      {t(SHARED_TEXT.HOME_FORTY_HADITHS_DESC)}
                    </Text>
                  </View>
                  <View className="h-[16px] bg-royal-blue w-full"></View>
                </Pressable>
              </Link>
              <Link href={'(tabs)/(hadeeth)'} asChild>
                <Pressable className="border border-royal-blue flex flex-1 justify-between items-center rounded-md">
                  <LinearGradient
                    // Background Linear Gradient
                    colors={['#22276E', '#008080']}
                    className="w-full flex-grow justify-between"
                  >
                    <View className="p-2">
                      <Text className="text-white text-lg">{t(SHARED_TEXT.HOME_SIX_BOOKS_TITLE)}</Text>
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
                    <TouchableHighlight className="p-1" underlayColor="#333">
                      <Share2 color="white" absoluteStrokeWidth={2} size={16} />
                    </TouchableHighlight>
                    <TouchableHighlight className="p-1" underlayColor="#333">
                      <Heart color="white" absoluteStrokeWidth={2} size={16} />
                    </TouchableHighlight>
                    <TouchableHighlight className="p-1" underlayColor="#333">
                      <Bookmark
                        color="white"
                        absoluteStrokeWidth={2}
                        size={16}
                      />
                    </TouchableHighlight>
                  </View>
                  <View className="flex flex-row items-center space-x-2">
                    <Text className="text-white">{t(SHARED_TEXT.VIEW_MORE_LABEL)}</Text>
                    <ArrowRight size={18} color={'white'} />
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Home
