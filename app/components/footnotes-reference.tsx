import { isEmpty } from 'es-toolkit/compat'
import { Text, View } from 'react-native'
import React from 'react'
import type { Footnote } from '@/app/types'

interface FootnotesReferenceProps {
  footnotes?: Footnote[];
  type: string;
}

function FootnotesReference({ footnotes, type }: FootnotesReferenceProps) {
  if (!footnotes || isEmpty(footnotes) || footnotes.every(isEmpty)) {
    return null
  }

  return (
    <>
      {footnotes.map((footnote, footnoteIndex) => {
        if (footnote.type !== type) return null

        const isArabic = footnote.language === 'ar'
        return (
          <View
            key={footnote.id ?? footnoteIndex}
            className="mt-2 flex flex-row items-start gap-1"
          >
            <Text className="text-blue-900/80 text-xs font-bold">
              {footnote.number}
            </Text>
            <Text
              className={`text-[#97999c] font-semibold text-sm ${
                isArabic ? 'font-arabic-regular text-right' : ''
              }`}
              style={isArabic ? { writingDirection: 'rtl' } : undefined}
            >
              {footnote.content}
            </Text>
          </View>
        )
      })}
    </>
  )
}

export default FootnotesReference
