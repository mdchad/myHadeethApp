import React from 'react'
import { View, Pressable } from 'react-native'
import ChapterTitle from './chapter-title'
import HadithItem from './hadith-item'
import type { ChapterWithHadiths } from '@/app/types'

interface ChapterSectionProps {
  chapter: ChapterWithHadiths;
  footnoteRefs: React.RefObject<Record<string, any>>;
  onContentPress: () => void;
}

/**
 * Renders one chapter as a self-contained section:
 *   ChapterTitle (with its scoped footnotes)
 *   └── HadithItem × N   (in sort_order, already filtered)
 *
 * The hierarchy here mirrors the API: Volume → Chapter → Hadith.
 */
const ChapterSection: React.FC<ChapterSectionProps> = ({
  chapter,
  footnoteRefs,
  onContentPress,
}) => {
  return (
    <Pressable onPress={onContentPress}>
      <ChapterTitle
        chapter={chapter}
        footnotes={chapter.footnotes}
        footnoteRefs={footnoteRefs}
      />
      {chapter.hadiths.map((hadith) => (
        <View key={hadith.id} className="space-y-8 bg-reading-background mb-4">
          <HadithItem hadith={hadith} footnoteRefs={footnoteRefs} />
        </View>
      ))}
    </Pressable>
  )
}

export default ChapterSection
