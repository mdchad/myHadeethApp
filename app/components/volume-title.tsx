import React from 'react'
import { View, Text } from 'react-native'
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'
import type { Footnote, Volume } from '@/app/types'

interface VolumeTitleProps {
  volume: Volume | null | undefined;
  volumeFootnotes?: Footnote[];
  footnoteRefs: React.MutableRefObject<Record<string, any>>;
}

const VolumeTitle: React.FC<VolumeTitleProps> = ({ volume, volumeFootnotes = [], footnoteRefs }) => {
  if (!volume) return null

  return (
    <View className="pb-2 border-b border-b-royal-blue-950 mb-3">
      <View className="flex flex-row items-center">
        <View className="flex-1">
          <FootnotesMarker
            footnotes={volumeFootnotes}
            type={'volume_title.ms'}
            index={1}
            footnoteRefs={footnoteRefs}
            hadithId={volume.id}
          >
            <Text className="text-lg font-semibold text-royal-blue-950">
              {volume.title_ms}
            </Text>
          </FootnotesMarker>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-[26px] text-right font-semibold text-royal-blue-950 font-arabic-regular">
            {volume.title_ar}
          </Text>
        </View>
      </View>
      <FootnotesReference footnotes={volumeFootnotes} type={'volume_title.ms'} />
    </View>
  )
}

export default VolumeTitle
