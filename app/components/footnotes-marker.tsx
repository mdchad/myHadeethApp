import { isEmpty } from 'es-toolkit/compat'
import React from 'react'
import { Text } from 'react-native'
import toSuperscript from '../utils/toSuperscript'
import type { Footnote } from '@/app/types'

interface FootnotesMarkerProps {
  children: React.ReactNode;
  footnotes?: Footnote[];
  type: string;
  index: number;
  footnoteRefs: React.RefObject<Record<string, any>>;
  hadithId?: string;
}

const FootnotesMarker: React.FC<FootnotesMarkerProps> = ({
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
  const firstChild = childrenArray[0]

  if (!firstChild || !React.isValidElement(firstChild)) {
    return children
  }

  // isValidElement narrows props to `unknown`; we duck-type on text/children
  // below, so widen to an any-props element once here.
  const originalChild = firstChild as React.ReactElement<Record<string, any>>

  // Extract text content - handle both custom components and HTML elements
  const originalText =
    originalChild.props?.text || originalChild.props?.children || ''

  // Sort footnotes by position (ascending order for proper text slicing)
  const sortedFootnotes = [...footnotes].sort((a, b) => a.position - b.position)

  // Filter footnotes for this specific type and index (1-based hadith_index)
  const filteredFootnotes = sortedFootnotes.filter(
    (footnote) =>
      type === footnote.type &&
      (footnote.hadith_index ?? null) === index
  )

  // If no footnotes for this content, return original
  if (filteredFootnotes.length === 0) {
    return children
  }

  // Determine if this is a custom component (has 'text' prop) or HTML element (has 'children')
  const isCustomComponent = originalChild.props?.text !== undefined

  // Create positions array with footnote markers
  const positions = filteredFootnotes.map((footnote) => ({
    position: footnote.position,
    marker: (
      <Text
        className="text-2xl text-blue-900/80 font-bold"
        key={`footnote-${footnote.number}`}
        ref={(el) => {
          if (footnoteRefs.current && el) {
            const key = `${hadithId}-${footnote.number}`
            footnoteRefs.current[key] = el
          }
        }}
      >
        {toSuperscript(String(footnote.number), 'reference')}
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
  const result: React.ReactNode[] = []

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

export default FootnotesMarker
