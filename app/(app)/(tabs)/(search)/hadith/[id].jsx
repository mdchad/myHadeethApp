import React from 'react'
import {
  Text,
  View,
  Share,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Bookmark, Heart, Share2 } from 'lucide-react-native'
import { useGetHadith } from '../../../../shared/fetcher/useHadiths'
import Header from '../../../../components/header'

function toSuperscript(str, type) {
  const superscripts = {
    0: '⁰',
    1: '¹',
    2: '²',
    3: '³',
    4: '⁴',
    5: '⁵',
    6: '⁶',
    7: '⁷',
    8: '⁸',
    9: '⁹'
  }

  if (type === 'text') {
    str = str.replace(/\[(\d+)\]/g, (match, p1) => {
      return p1
        .split('')
        .map((char) => superscripts[char] || char)
        .join('')
    })

    return str
  }

  if (type === 'reference') {
    return str
      .toLowerCase()
      .split('')
      .map((char) => superscripts[char] || char)
      .join('')
  }
}

function HadithContent() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const { isLoading, isError, data, error } = useGetHadith(id)

  const onShare = (hadith) => {
    let formattedMessage = ''

    hadith.content.forEach((item, index) => {
      formattedMessage += `\n${item.ar}\n\n ${item.ms}\n\n\n`
    })

    // Add the book title and website line only once at the end
    formattedMessage += `${hadith.book_title.ms}\n\nwww.myhadeeth.com.my`
    Share.share({ message: formattedMessage })
      .then((result) => {
        // ... existing logic
      })
      .catch((error) => {
        console.log('Error sharing:', error)
      })
  }

  const onSave = () => {
    // Implement save logic if needed
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <ScrollView>
      <Header
        title={data?.book_title?.ms}
        onPressButton={() => router.back()}
      />
      <View className="flex-1 p-4 pb-0 bg-white">
        <View className="flex flex-row pb-2 items-center border-b border-b-royal-blue mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-royal-blue">
              {data ? data?.volume_title.ms : ''}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text
              className="text-[26px] text-right font-semibold text-royal-blue"
              style={{ fontFamily: 'Traditional_ArabicRegular' }}
            >
              {data ? data?.volume_title.ar : ''}
            </Text>
          </View>
        </View>
        <View className="flex-1">
          {data?.chapter_title?.ms && (
            <View className="bg-gray-100 rounded-xl mb-4 p-4">
              <View className="flex flex-row justify-between">
                <View className="flex-1 mr-1">
                  <Text className="text-royal-blue">
                    {toSuperscript(data?.chapter_title?.ms, 'text')}
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    {data?.chapter_transliteration?.ms}
                  </Text>
                </View>
                <View className="flex-1 items-end ml-1">
                  <Text
                    className="text-[22px] text-right text-royal-blue"
                    style={{
                      fontFamily: 'Traditional_ArabicRegular'
                    }}
                  >
                    {data?.chapter_title?.ar}
                  </Text>
                </View>
              </View>
              {data?.chapter_metadata?.ms && (
                <View className="flex flex-row justify-between mt-4 pt-4 border-t-0.5 border-t-gray-500">
                  <View className="flex-1 mr-1">
                    <Text className="text-gray-800">
                      {toSuperscript(data?.chapter_metadata?.ms, 'text')}
                    </Text>
                  </View>
                  <View className="flex-1 items-end ml-1">
                    <Text
                      className="text-[22px] text-right text-gray-800"
                      style={{
                        fontFamily: 'Traditional_ArabicRegular'
                      }}
                    >
                      {data?.chapter_metadata?.ar}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          <View className="space-y-8 bg-white mb-4 border border-royal-blue">
            <View key={data._id}>
              {data?.content.map((content, i) => {
                if (!content.ar) {
                  return null
                }
                return (
                  <View key={i}>
                    <View className="px-4 py-6">
                      <View>
                        <TextInput
                          className="text-gray-800 text-right text-3xl"
                          style={{ fontFamily: 'Traditional_ArabicRegular' }}
                          scrollEnabled={false}
                          readOnly
                          multiline
                          value={content.ar}
                        />
                        <TextInput
                          className="text-gray-800 pb-4 text-lg overflow-hidden leading-loose"
                          scrollEnabled={false}
                          readOnly
                          multiline
                          style={{ fontFamily: 'KFGQPC_Regular' }}
                          value={content.ms}
                        />
                      </View>
                      {/*{!!hadith.footnotes.length && (*/}
                      {/*    <View className="flex space-y-2 pt-2 border-t border-t-gray-500">*/}
                      {/*        {hadith.footnotes.map(footnote => {*/}
                      {/*            return (*/}
                      {/*                <Text key={footnote.number}>*/}
                      {/*                    <Text className="text-xs">{toSuperscript(footnote.number, 'reference')}&nbsp;</Text>*/}
                      {/*                    <Text className="text-xs text-gray-800">{footnote.text}</Text>*/}
                      {/*                </Text>*/}
                      {/*            )*/}
                      {/*        })}*/}
                      {/*    </View>*/}
                      {/*)}*/}
                    </View>
                  </View>
                )
              })}
            </View>
            <View className="flex flex-row justify-end items-center bg-royal-blue">
              <TouchableHighlight
                className="p-1"
                underlayColor="#333"
                onPress={() => onShare(data)}
              >
                <Share2 color="white" absoluteStrokeWidth={2} size={16} />
              </TouchableHighlight>
              <TouchableHighlight
                className="p-1"
                underlayColor="#333"
                onPress={() => onSave(data)}
              >
                <Heart color="white" absoluteStrokeWidth={2} size={16} />
              </TouchableHighlight>
              <TouchableHighlight
                className="p-1"
                underlayColor="#333"
                onPress={() => onSave(data)}
              >
                <Bookmark color="white" absoluteStrokeWidth={2} size={16} />
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HadithContent
