import React from 'react';
import { View, Text } from 'react-native';
import QuranText from './quran-text';
import SpecialText from './special-text';

interface BilingualText {
  ms: string;
  ar: string;
}

interface VolumeDetails {
  metadata?: BilingualText;
}

interface VolumeMetadataHeaderProps {
  volumeDetails: VolumeDetails;
}

const VolumeMetadataHeader: React.FC<VolumeMetadataHeaderProps> = ({ volumeDetails }) => {
  if (!volumeDetails?.metadata?.ar) return null;

  return (
    <View className="p-4 mb-2">
      <View className="p-4 gap-2 bg-metadata-background">
        <Text
          className="text-lg font-semibold text-royal-blue-950 mb-2 font-arabic-bold dark:text-white"
          style={{ writingDirection: 'rtl' }}
        >
          <QuranText
            font={'arabic-bold'}
            text={volumeDetails.metadata.ar}
          />
        </Text>
        <Text className="text-sm font-semibold text-royal-blue-950">
          <SpecialText
            className="text-royal-blue-950 font-semibold"
            text={volumeDetails.metadata.ms}
          />
        </Text>
      </View>
    </View>
  );
};

export default VolumeMetadataHeader; 