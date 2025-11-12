import React from 'react';
import { View, Text } from 'react-native';
import QuranText from './QuranText';
import SpecialText from './SpecialText';
import FootnotesMarker from './footnotes-marker'
import FootnotesReference from './footnotes-reference'

interface BilingualText {
  ms?: string;
  ar?: string;
}

interface Footnote {
  position: number;
  number: number;
  type: string;
  hadithIndex: number;
  ms?: string;
  ar?: string;
}

interface HadithItem {
  _id: string;
  chapter_title?: BilingualText;
  chapter_transliteration?: BilingualText;
  chapter_metadata?: BilingualText;
  footnotes?: Footnote[];
}

interface HadithChapterTitleProps {
  item: HadithItem;
  footnoteRefs: React.MutableRefObject<Record<string, any>>;
}

const HadithChapterTitle: React.FC<HadithChapterTitleProps> = ({ item, footnoteRefs }) => {
  return (
    <View className="bg-gray-100 rounded-xl mb-4 p-4 gap-10">
      <View className="gap-4">
        <Text
          className="text-lg text-royal-blue font-arabic-bold font-bold"
          style={{
            writingDirection: 'rtl'
          }}
        >
          <QuranText
            text={item?.chapter_title?.ar}
            font={'arabic-bold'}
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
            className="text-lg text-gray-800 leading-8 font-arabic-regular"
            style={{
              writingDirection: 'rtl'
            }}
          >
            <QuranText text={item?.chapter_metadata?.ar} />
          </Text>
          <Text
            className="text-gray-700 leading-6 text-justify tracking-tight font-arabic-symbols"
            style={{
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
                font={'arabic-symbols'}
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