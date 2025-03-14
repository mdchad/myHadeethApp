import React from 'react';
import { View, Text } from 'react-native';
import QuranText from './QuranText';
import SpecialText from './SpecialText';

const VolumeMetadataHeader = ({ volumeDetails }) => {
  if (!volumeDetails?.metadata?.ar) return null;

  return (
    <View className="bg-royal-blue/20 rounded-xl p-4 mb-2">
      <Text
        className="text-lg font-semibold text-royal-blue mb-2"
        style={{ writingDirection: 'rtl' }}
      >
        <QuranText
          font={'arabic_bold'}
          className="text-royal-blue font-semibold"
          text={volumeDetails.metadata.ar}
        />
      </Text>
      <Text className="text-sm font-semibold text-royal-blue">
        <SpecialText
          className="text-royal-blue font-semibold"
          text={volumeDetails.metadata.ms}
        />
      </Text>
    </View>
  );
};

export default VolumeMetadataHeader; 