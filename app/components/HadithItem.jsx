import React, { useRef } from 'react'
import { View, Text } from 'react-native'
import QuranText from './QuranText'
import { isEmpty } from 'es-toolkit/compat'

const FootnoteText = ({
  children,
  footnotes = [],
  type,
  index,
  footnoteRefs,
  hadithId
}) => {
  if (
    isEmpty(footnotes) ||
    (Array.isArray(footnotes) && footnotes.every(isEmpty))
  ) {
    return children
  }

  const childrenArray = React.Children.toArray(children)
  const originalChild = childrenArray[0]

  if (!originalChild || !React.isValidElement(originalChild)) {
    return children
  }

  // Extract text content - handle both custom components and HTML elements
  const originalText =
    originalChild.props?.text || originalChild.props?.children || ''

  // Sort footnotes by position (ascending order for proper text slicing)
  const sortedFootnotes = [...footnotes].sort((a, b) => a.position - b.position)

  // Filter footnotes for this specific type and index
  const filteredFootnotes = sortedFootnotes.filter(
    (footnote) => type === footnote.type && footnote.hadithIndex === index
  )

  // If no footnotes for this content, return original
  if (filteredFootnotes.length === 0) {
    return children
  }

  // Determine if this is a custom component (has 'text' prop) or HTML element (has 'children')
  const isCustomComponent = originalChild.props?.text !== undefined

  // Create positions array with footnote markers
  const positions = filteredFootnotes.map((footnote, i) => ({
    position: footnote.position,
    marker: (
      <Text
        className="text-xs align-top inline-block"
        key={`footnote-${footnote.number}`}
        ref={(el) => {
          if (footnoteRefs.current && el) {
            const key = `${hadithId}-${footnote.number}`
            footnoteRefs.current[key] = el
          }
        }}
      >
        [{footnote.number}]
      </Text>
    ),
    footnote
  }))

  // Build the final content by creating segments with embedded footnotes
  const segments = []
  let lastPosition = 0

  positions.forEach(({ position, marker }, posIndex) => {
    const textSegment = originalText.slice(lastPosition, position)
    segments.push({
      text: textSegment,
      footnote: marker,
      key: `segment-${posIndex}`
    })
    lastPosition = position
  })

  // Add remaining text after the last footnote
  if (lastPosition < originalText.length) {
    const remainingText = originalText.slice(lastPosition)
    segments.push({
      text: remainingText,
      footnote: null,
      key: 'segment-final'
    })
  }

  // If we only have one segment (all footnotes at the end), embed them in the element
  if (
    segments.length === 1 ||
    (segments.length > 1 &&
      segments.slice(0, -1).every((seg) => seg.text === ''))
  ) {
    const lastSegment = segments[segments.length - 1]
    const allFootnotes = segments
      .filter((seg) => seg.footnote)
      .map((seg) => seg.footnote)

    const combinedContent = [lastSegment.text, ...allFootnotes]

    if (isCustomComponent) {
      const componentElement = React.cloneElement(originalChild, {
        ...originalChild.props,
        text: originalText // Just the text string, no markers
      })

      // If footnotes exist, render component + markers separately
      if (allFootnotes.length > 0) {
        return (
          <>
            {componentElement}
            {allFootnotes}
          </>
        )
      }

      return componentElement
    } else {
      return React.cloneElement(originalChild, {
        ...originalChild.props,
        children: combinedContent
      })
    }
  }

  // For multiple segments, create separate elements
  const result = []

  segments.forEach(({ text, footnote, key }) => {
    if (text) {
      if (isCustomComponent) {
        result.push(
          React.cloneElement(originalChild, {
            key,
            ...originalChild.props,
            text: text
          })
        )
      } else {
        result.push(
          React.cloneElement(originalChild, {
            key,
            ...originalChild.props,
            children: text
          })
        )
      }
    }

    if (footnote) {
      result.push(footnote)
    }
  })

  return result
}

const HadithItem = React.memo(({ hadith }) => {
  const footnoteRefs = useRef({})

  return (
    <View key={hadith.id}>
      {hadith.content.map((content, i) => {
        if (!content.ar) return null
        return (
          <View key={i}>
            <View className="px-4 py-6 gap-6">
              <Text
                className="text-gray-800 text-2xl leading-10 mb-2"
                style={{
                  fontFamily: 'arabic_regular',
                  writingDirection: 'rtl'
                }}
              >
                <QuranText text={content.ar} />
              </Text>
              <Text
                className="text-gray-800 pb-4 text-lg overflow-hidden leading-relaxed text-justify tracking-tight"
                style={{
                  fontFamily: 'arabic_symbols',
                  writingDirection: 'ltr'
                }}
              >
                <FootnoteText
                  footnotes={hadith.footnotes}
                  type={'content.ms'}
                  index={i + 1}
                  footnoteRefs={footnoteRefs}
                  hadithId={hadith._id}
                >
                  <QuranText
                    text={content.ms}
                    font={'arabic_symbols'}
                    special={true}
                  />
                </FootnoteText>
              </Text>
              <View className="lg:hidden ">
                {!(
                  isEmpty(hadith.footnotes) || hadith.footnotes.every(isEmpty)
                ) &&
                  hadith.footnotes.map((footnote, footnoteIndex) => (
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
                  ))}
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default HadithItem
