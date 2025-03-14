import React from 'react';
import { View, Text } from 'react-native';

const VolumeTitle = ({ volumeTitle }) => {
  if (!volumeTitle) return null;

  return (
    <View className="flex flex-row pb-2 items-center border-b border-b-royal-blue mb-3">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-royal-blue">
          {volumeTitle.ms}
        </Text>
      </View>
      <View className="flex-1 items-end">
        <Text
          className="text-[26px] text-right font-semibold text-royal-blue"
          style={{ fontFamily: 'arabic_regular' }}
        >
          {volumeTitle.ar}
        </Text>
      </View>
    </View>
  );
};

export default VolumeTitle; 