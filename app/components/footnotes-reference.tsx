import { isEmpty } from 'es-toolkit/compat'
import { Text, View } from 'react-native'
import React from 'react'

function FootnotesReference({ hadith, type }) {
  return (
    <>
      {!(
          isEmpty(hadith.footnotes) || hadith.footnotes.every(isEmpty)
        ) &&
        hadith.footnotes.map((footnote, footnoteIndex) => {
          if (footnote.type === type) {
            return (
              <View
                key={footnoteIndex}
                className="mt-2 flex flex-row items-start gap-1"
              >
                <Text className="text-blue-900/80 text-xs font-bold">
                  {footnote.number}
                </Text>
                <Text className="text-[#97999c] font-semibold text-sm">
                  {footnote.ms}
                </Text>
              </View>
            )
          }
        })}
    </>
  )
}

export default FootnotesReference