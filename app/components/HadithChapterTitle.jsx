import React from 'react';
import { View, Text } from 'react-native';
import QuranText from './QuranText';
import SpecialText from './SpecialText';
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'

const HadithChapterTitle = ({ item, footnoteRefs }) => {
  return (
    <View className="bg-gray-100 rounded-xl mb-4 p-4 gap-10">
      <View className="gap-4">
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
        <View>
          <Text>
            <FootnotesMarker
              footnotes={item.footnotes}
              type={'chapter_title.ms'}
              index={1}
              footnoteRefs={footnoteRefs}
              hadithId={item._id}
            >
              <SpecialText
                className="text-royal-blue font-semibold"
                text={item?.chapter_title?.ms}
              />
            </FootnotesMarker>
          </Text>
          <Text className="text-gray-600 mt-1">
            {item?.chapter_transliteration?.ms}
          </Text>
        </View>
      </View>
      {item?.chapter_metadata?.ms && (
        <View className="gap-4">
          <Text
            className="text-lg text-gray-800 leading-8"
            style={{
              writingDirection: 'rtl',
              fontFamily: 'arabic_regular'
            }}
          >
            <QuranText text={item?.chapter_metadata?.ar} />
          </Text>
          <Text
            className="text-gray-700 leading-6 text-justify tracking-tight"
            style={{
              fontFamily: 'arabic_symbols',
              writingDirection: 'ltr'
            }}
          >
            <FootnotesMarker
              footnotes={item.footnotes}
              type={'chapter_metadata.ms'}
              index={1}
              footnoteRefs={footnoteRefs}
              hadithId={item._id}
            >
              <QuranText
                text={item?.chapter_metadata?.ms}
                font={'arabic_symbols'}
                special={true}
              />
            </FootnotesMarker>
          </Text>
          <FootnotesReference hadith={item} type={'chapter_title.ms'} />
          <FootnotesReference hadith={item} type={'chapter_metadata.ms'} />
        </View>
      )}
    </View>
  );
};

export default HadithChapterTitle; 