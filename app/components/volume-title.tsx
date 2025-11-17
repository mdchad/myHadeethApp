import React from 'react';
import { View, Text } from 'react-native';
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'

interface VolumeText {
  ms: string;
  ar: string;
}

interface Footnote {
  position: number;
  number: number;
  type: string;
  hadithIndex: number;
  ms?: string;
  ar?: string;
}

interface Hadith {
  _id?: string;
  footnotes?: Footnote[];
}

interface VolumeTitleProps {
  volumeTitle: VolumeText | null;
  hadiths: Hadith[];
  footnoteRefs: React.MutableRefObject<Record<string, any>>;
}

const VolumeTitle: React.FC<VolumeTitleProps> = ({ volumeTitle, hadiths, footnoteRefs }) => {
  if (!volumeTitle) return null;

  return (
    <View className="pb-2 border-b border-b-royal-blue-950 mb-3">
      <View className="flex flex-row items-center">
        <View className="flex-1">
          <FootnotesMarker
            footnotes={hadiths[0].footnotes}
            type={"volume_title.ms"}
            index={1}
            footnoteRefs={footnoteRefs}
            hadithId={hadiths[0]._id}
          >
            <Text className="text-lg font-semibold text-royal-blue-950">
              {volumeTitle.ms}
            </Text>
          </FootnotesMarker>
        </View>
        <View className="flex-1 items-end">
          <Text
            className="text-[26px] text-right font-semibold text-royal-blue-950 font-arabic-regular"
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