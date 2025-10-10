import React from 'react';
import { View, Text } from 'react-native';
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'

const VolumeTitle = ({ volumeTitle, hadiths, footnoteRefs }) => {
  if (!volumeTitle) return null;

  return (
    <View className="pb-2 border-b border-b-royal-blue mb-3">
      <View className="flex flex-row items-center">
        <View className="flex-1">
          <FootnotesMarker
            footnotes={hadiths[0].footnotes}
            type={"volume_title.ms"}
            index={1}
            footnoteRefs={footnoteRefs}
            hadithId={hadiths[0]._id}
          >
            <Text className="text-lg font-semibold text-royal-blue">
              {volumeTitle.ms}
            </Text>
          </FootnotesMarker>
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
      <FootnotesReference hadith={hadiths[0]} type={"volume_title.ms"} />
    </View>
  );
};

export default VolumeTitle; 