import React from 'react'
import { View, Text } from 'react-native'
import QuranText from './quran-text'
import SpecialText from './special-text'
import type { Volume } from '@/app/types'

interface VolumeMetadataHeaderProps {
  volume: Volume | null | undefined;
}

const VolumeMetadataHeader: React.FC<VolumeMetadataHeaderProps> = ({ volume }) => {
  if (!volume?.metadata_ar) return null

  return (
    <View className="p-4 mb-2">
      <View className="p-4 gap-2 bg-metadata-background">
        <Text
          className="text-lg font-semibold text-royal-blue-950 mb-2 font-arabic-bold dark:text-white"
          style={{ writingDirection: 'rtl' }}
        >
          <QuranText font={'arabic-bold'} text={volume.metadata_ar} />
        </Text>
        {!!volume.metadata_ms && (
          <Text className="text-sm font-semibold text-royal-blue-950">
            <SpecialText
              className="text-royal-blue-950 font-semibold"
              text={volume.metadata_ms}
            />
          </Text>
        )}
      </View>
    </View>
  )
}

export default VolumeMetadataHeader
