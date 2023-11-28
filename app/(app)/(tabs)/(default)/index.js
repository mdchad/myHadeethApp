import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  StyleSheet, TouchableHighlight, Pressable
} from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import Page from '@components/page'
import {ArrowRight, Bookmark, ChevronRightSquare, Heart, Share2} from "lucide-react-native";
import {useGetVolumes} from "../../../shared/fetcher/useVolumes";
import {useGetTodayHadith} from "../../../shared/fetcher/useTodayHadith";
import {LinearGradient} from "expo-linear-gradient";
import {Link} from "expo-router";
// import Header from '@components/header';

function Home() {
  const { isLoading, isError, data, error } = useGetTodayHadith()

  return (
    <Page class="bg-white">
      <View className="flex-1 flex space-y-3 bg-white">
        <ScrollView>
          <View className="mx-4 p-3 flex space-y-6">
            <View className="space-y-5">
              <Text
                className={`text-3xl text-royal-blue font-bold leading-none tracking-tight`}
              >
                Daily hadith
              </Text>

              <View className="bg-white border border-1 border-royal-blue space-y-3 rounded-md">
                <View className="p-3">
                  <Text className="font-bold text-royal-blue">
                    {data?.book_title.ms}
                  </Text>
                  <ChevronRightSquare color="black" size={18} />
                  <Text className="font-bold text-royal-blue">
                    {data?.volume_title.ms}
                  </Text>
                  <Text>{data?.content[0].ar}</Text>
                  <Text>{data?.content[0].ms}</Text>
                </View>
                <View className="flex flex-row justify-between items-center bg-royal-blue">
                  <View className="flex flex-row items-center">
                    <TouchableHighlight
                      className="p-1"
                      underlayColor="#333"
                    >
                      <Share2
                        color="white"
                        absoluteStrokeWidth={2}
                        size={16}
                      />
                    </TouchableHighlight>
                    <TouchableHighlight
                      className="p-1"
                      underlayColor="#333"
                    >
                      <Heart
                        color="white"
                        absoluteStrokeWidth={2}
                        size={16}
                      />
                    </TouchableHighlight>
                    <TouchableHighlight
                      className="p-1"
                      underlayColor="#333"
                    >
                      <Bookmark
                        color="white"
                        absoluteStrokeWidth={2}
                        size={16}
                      />
                    </TouchableHighlight>
                  </View>
                  <View className="flex flex-row items-center space-x-2">
                    <Text className="text-white">View More</Text>
                    <ArrowRight size={18} color={'white'}/>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex flex-row space-x-2">
              <View className="border border-royal-blue flex flex-1 items-center rounded-md">
                <View className="p-2 w-full">
                  <Text className="text-lg text-royal-blue">Forty Hadiths</Text>
                  <Text className="text-xs text-royal-blue break-words">Forty known famous hadith</Text>
                </View>
                <View className="h-[16px] bg-royal-blue w-full">
                </View>
              </View>
              <Link href={'(tabs)/(hadeeth)'} asChild>
                <Pressable className="border border-royal-blue flex flex-1 items-center rounded-md">
                  <LinearGradient
                    // Background Linear Gradient
                    colors={['#22276E', '#008080']}
                    className="w-full "
                  >
                  <View className="p-2 w-full">
                    <Text className="text-white text-lg">Kutub Sittah</Text>
                    <Text className="text-white text-xs break-words">The six most reliable hadith books</Text>
                  </View>
                  <View className="h-[16px] bg-royal-blue w-full">
                  </View>
                  </LinearGradient>
                </Pressable>
              </Link>
            </View>

            <View className="bg-white border border-1 border-royal-blue space-y-3 rounded-md">
              <View className="p-3">
                <Text className="font-bold">Introduction to MyWay app</Text>
                <Text></Text>
              </View>
              <View className="flex flex-row justify-between items-center bg-royal-blue">
                <View className="flex flex-row items-center">
                  <TouchableHighlight
                    className="p-1"
                    underlayColor="#333"
                  >
                    <Share2
                      color="white"
                      absoluteStrokeWidth={2}
                      size={16}
                    />
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="p-1"
                    underlayColor="#333"
                  >
                    <Heart
                      color="white"
                      absoluteStrokeWidth={2}
                      size={16}
                    />
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="p-1"
                    underlayColor="#333"
                  >
                    <Bookmark
                      color="white"
                      absoluteStrokeWidth={2}
                      size={16}
                    />
                  </TouchableHighlight>
                </View>
                <View className="flex flex-row items-center space-x-2">
                  <Text className="text-white">View More</Text>
                  <ArrowRight size={18} color={'white'}/>
                </View>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>
    </Page>
  )
}

const makeStyles = (fontScale) =>
  StyleSheet.create({
    safeAreaViewContainer: {
      minWidth: '100%',
      minHeight: '100%',
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center'
    },
    screenContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20
    },
    boxContainer: {
      paddingHorizontal: 36,
      paddingVertical: 36,
      alignItems: 'center',
      backgroundColor: '#D0D0D0',
      width: '100%',
      height: '100%'
    },
    imageTop: {
      height: 200,
      width: 300
    },
    imageBot: {
      height: 200,
      width: 300,
      marginTop: 20
    }
  })

export default Home
