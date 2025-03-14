import React from 'react';
import { View, Text } from 'react-native';
import QuranText from './QuranText';
import SpecialText from './SpecialText';

const HadithChapterTitle = ({ item, toSuperscript }) => {
  if (!item?.chapter_title?.ms) return null;

  return (
    <View className="bg-gray-100 rounded-xl mb-4 p-4">
      <View className="flex flex-row justify-between space-x-6">
        <View className="flex-1 mr-1">
          <SpecialText
            className="text-royal-blue font-semibold"
            text={toSuperscript(item?.chapter_title?.ms, 'text')}
          />
          <Text className="text-gray-600 mt-1">
            {item?.chapter_transliteration?.ms}
          </Text>
        </View>
        <View className="flex-1 items-end ml-1">
          <Text
            className="text-lg text-royal-blue"
            style={{
              fontFamily: 'arabic_bold',
              writingDirection: 'rtl',
              fontWeight: 700
            }}
          >
            <QuranText
              text={item?.chapter_title?.ar}
              font={'arabic_bold'}
            />
          </Text>
        </View>
      </View>
      {item?.chapter_metadata?.ms && (
        <View className="flex flex-row justify-between space-x-6 mt-4 pt-4 border-t-0.5 border-t-gray-500">
          <View className="flex-1 mr-1">
            <Text
              className="text-gray-800 leading-6"
              style={{
                fontFamily: 'arabic_symbols',
                writingDirection: 'ltr'
              }}
            >
              <QuranText
                text={toSuperscript(item?.chapter_metadata?.ms, 'text')}
                font={'arabic_symbols'}
                special={true}
              />
            </Text>
          </View>
          <View className="flex-1 items-end ml-1">
            <Text
              className="text-lg text-gray-800 leading-8"
              style={{
                writingDirection: 'rtl',
                fontFamily: 'arabic_regular'
              }}
            >
              <QuranText text={item?.chapter_metadata?.ar} />
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default HadithChapterTitle; 