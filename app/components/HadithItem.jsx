import React from 'react';
import { View, Text } from 'react-native';
import QuranText from './QuranText';

const HadithItem = React.memo(({ hadith }) => (
  <View key={hadith.id}>
    {hadith.content.map((content, i) => {
      if (!content.ar) return null;
      return (
        <View key={i}>
          <View className="px-4 py-6 gap-6">
            <Text
              className="text-gray-800 text-2xl leading-10 mb-2"
              style={{ fontFamily: 'arabic_regular', writingDirection: 'rtl' }}
            >
              <QuranText text={content.ar} />
            </Text>
            <Text
              className="text-gray-800 pb-4 text-lg overflow-hidden leading-loose text-justify"
              style={{ fontFamily: 'arabic_symbols', writingDirection: 'ltr' }}
            >
              <QuranText
                text={content.ms}
                font={'arabic_symbols'}
                special={true}
              />
            </Text>
          </View>
        </View>
      );
    })}
  </View>
));

export default HadithItem; 