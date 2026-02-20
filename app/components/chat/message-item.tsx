import React, { useEffect, useRef, memo } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import Animated2, { FadeIn } from 'react-native-reanimated'

// ─── Typing dots ────────────────────────────────────────────────────────────

export const TypingDots = memo(function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const createAnimation = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      )

    const anims = [
      createAnimation(dot1, 0),
      createAnimation(dot2, 150),
      createAnimation(dot3, 300),
    ]
    anims.forEach((a) => a.start())
    return () => anims.forEach((a) => a.stop())
  }, [dot1, dot2, dot3])

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
  })

  return (
    <View style={dotStyles.container}>
      <Animated.Text style={[dotStyles.dot, dotStyle(dot1)]}>●</Animated.Text>
      <Animated.Text style={[dotStyles.dot, dotStyle(dot2)]}>●</Animated.Text>
      <Animated.Text style={[dotStyles.dot, dotStyle(dot3)]}>●</Animated.Text>
    </View>
  )
})

const dotStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { color: '#8E8E93', fontSize: 12 },
})

// ─── Simple inline markdown renderer ────────────────────────────────────────
// Handles: **bold**, *italic*, `code`, # headers, - bullet lists
// Uses only View + Text — no FlatList, safe inside ScrollView.

function renderInline(text: string, baseStyle: any, key: string) {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<Text key={`${key}-t-${last}`} style={baseStyle} className="font-arabic-symbols">{text.slice(last, match.index)}</Text>)
    }
    const raw = match[0]
    if (raw.startsWith('**')) {
      parts.push(<Text key={`${key}-b-${match.index}`} style={[baseStyle, { fontWeight: 'bold' }]}>{raw.slice(2, -2)}</Text>)
    } else if (raw.startsWith('*')) {
      parts.push(<Text key={`${key}-i-${match.index}`} style={[baseStyle, { fontStyle: 'italic' }]}>{raw.slice(1, -1)}</Text>)
    } else if (raw.startsWith('`')) {
      parts.push(<Text key={`${key}-c-${match.index}`} style={[baseStyle, markdownStyles.code]} className="font-arabic-symbols">{raw.slice(1, -1)}</Text>)
    }
    last = match.index + raw.length
  }

  if (last < text.length) {
    parts.push(<Text key={`${key}-t-end`} style={baseStyle} className="font-arabic-symbols">{text.slice(last)}</Text>)
  }

  return parts
}

function SimpleMarkdown({ content, textStyle }: { content: string; textStyle: any }) {
  const lines = content.split('\n')

  return (
    <View style={{ gap: 2 }}>
      {lines.map((line, i) => {
        const key = `line-${i}`

        if (line.startsWith('### ')) {
          return <Text key={key} style={[textStyle, markdownStyles.h3]}>{line.slice(4)}</Text>
        }
        if (line.startsWith('## ')) {
          return <Text key={key} style={[textStyle, markdownStyles.h2]}>{line.slice(3)}</Text>
        }
        if (line.startsWith('# ')) {
          return <Text key={key} style={[textStyle, markdownStyles.h1]}>{line.slice(2)}</Text>
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <View key={key} style={markdownStyles.bulletRow}>
              <Text style={textStyle}>{'• '}</Text>
              <Text style={[textStyle, { flex: 1 }]} className="font-arabic-symbols">{renderInline(line.slice(2), textStyle, key)}</Text>
            </View>
          )
        }
        if (line === '') {
          return <View key={key} style={{ height: 6 }} className="font-arabic-symbols"/>
        }

        return (
          <Text key={key} style={textStyle}>
            {renderInline(line, textStyle, key)}
          </Text>
        )
      })}
    </View>
  )
}

const markdownStyles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  h2: { fontSize: 17, fontWeight: 'bold', marginBottom: 2 },
  h3: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  code: { fontFamily: 'Courier', backgroundColor: '#f0f0f0', borderRadius: 3 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
})

// ─── MessageItem ─────────────────────────────────────────────────────────────

interface MessageItemProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function MessageItem({ role, content, isStreaming }: MessageItemProps) {
  const isUser = role === 'user'

  const textStyle = {
    fontSize: 15,
    lineHeight: 22,
    color: isUser ? '#FFFFFF' : '#1C1C1E',
  }

  return (
    <Animated2.View
      entering={FadeIn.duration(300)}
      className={`mx-4 my-2 p-4 rounded-2xl ${
        isUser ? 'bg-royal-blue self-end' : 'bg-gray-100 dark:bg-gray-800 self-start'
      }`}
      style={{ maxWidth: '80%' }}
    >
      {content ? (
        isUser ? (
          <Text style={textStyle}>{content}</Text>
        ) : (
          <SimpleMarkdown content={content} textStyle={textStyle} />
        )
      ) : null}
    </Animated2.View>
  )
}
