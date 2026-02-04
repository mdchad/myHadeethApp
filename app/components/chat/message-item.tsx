import React from 'react'
import { View, Text } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

interface MessageItemProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function MessageItem({ role, content, isStreaming }: MessageItemProps) {
  const isUser = role === 'user'

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className={`mx-4 my-2 p-4 rounded-2xl ${
        isUser
          ? 'bg-royal-blue self-end'
          : 'bg-gray-100 dark:bg-gray-800 self-start'
      }`}
      style={{ maxWidth: '80%' }}
    >
      <Text
        className={`${
          isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'
        } text-base leading-6`}
      >
        {content}
      </Text>
      {isStreaming && (
        <View className="mt-2 flex-row items-center gap-1">
          <StreamingIndicator />
        </View>
      )}
    </Animated.View>
  )
}

function StreamingIndicator() {
  return (
    <View className="flex-row gap-1">
      <Animated.View
        className="w-2 h-2 bg-gray-400 rounded-full"
        entering={FadeIn.duration(400).delay(0)}
      />
      <Animated.View
        className="w-2 h-2 bg-gray-400 rounded-full"
        entering={FadeIn.duration(400).delay(150)}
      />
      <Animated.View
        className="w-2 h-2 bg-gray-400 rounded-full"
        entering={FadeIn.duration(400).delay(300)}
      />
    </View>
  )
}
