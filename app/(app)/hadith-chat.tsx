import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MessageItem, TypingDots } from '@/app/components/chat/message-item'
import { ToolCallItem } from '@/app/components/chat/tool-call-item'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { fetch as expoFetch } from 'expo/fetch'
import Page from '@/app/components/page'
import {
  KeyboardComposer,
  KeyboardAwareWrapper,
} from '@launchhq/react-native-keyboard-composer'

const API_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/chat`
const USER_AGENT = 'MyWayApp/1.0.0'

export default function HadithChatScreen() {
  const params = useLocalSearchParams()
  const scrollViewRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()

  // Extract hadith context from params and reconstruct hadith object
  const hadith = {
    id: params.hadithId as string,
    number: params.hadithNumber as string,
    book: {
      title_ms: (params.bookTitle as string) || 'Unknown',
    },
    content: [
      {
        ar: params.contentAr as string,
        ms: params.contentMs as string,
      },
    ],
  }

  // State for composer height (required for KeyboardAwareWrapper)
  const [composerHeight, setComposerHeight] = useState(48)

  // Use AI SDK's useChat hook
  const {
    messages,
    sendMessage,
    stop,
    error,
    status,
  } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: API_ENDPOINT,
      headers: {
        'User-Agent': USER_AGENT,
      },
      body: {
        hadith,
      },
    }),
  })

  // Derive loading state from status
  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    try {
      await sendMessage({ text: text.trim() })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const renderMessage = (item: any, index: number) => {
    const isLastMessage = index === messages.length - 1
    const isStreaming = isLastMessage && isLoading && item.role === 'assistant'

    // Extract parts from the message
    const parts = item.parts || []
    const elements: any[] = []

    // Process each part
    parts.forEach((part: any, partIndex: number) => {
      if (part.type === 'text') {
        // Text content part
        elements.push(
          <MessageItem
            key={`${item.id}-text-${partIndex}`}
            role={item.role}
            content={part.text}
            isStreaming={isStreaming && partIndex === parts.length - 1}
          />
        )
      } else if (part.type === 'tool-call') {
        // Tool call part
        elements.push(
          <ToolCallItem
            key={`${item.id}-tool-${partIndex}`}
            toolName={part.toolName}
            args={part.args}
            result={part.result}
          />
        )
      }
    })

    // If no parts or all parts processed, return elements
    if (elements.length > 0) {
      return <View key={item.id}>{elements}</View>
    }

    // Fallback for empty messages
    return null
  }

  return (
    <Page className="bg-white">
      <Stack.Screen
        options={{
          title: '',
          headerShown: true,
          headerBackTitle: 'Balik',
        }}
      />
      <View className="flex-1 bg-white dark:bg-gray-950">
        {/* Hadith Context Header */}
        <View className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Bertanya tentang:
          </Text>
          <Text
            className="text-sm text-gray-700 dark:text-gray-300 font-arabic-symbols"
            numberOfLines={2}
          >
            {hadith.content[0]?.ms}
          </Text>
        </View>

        {/* Messages List with Keyboard Aware Wrapper */}
        <KeyboardAwareWrapper style={styles.wrapper} extraBottomInset={composerHeight}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: composerHeight + 16 } // Composer height + small breathing room
            ]}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message, index) => renderMessage(message, index))}
            {status === 'submitted' && (
              <View className="mx-4 my-2 p-4 rounded-2xl bg-gray-100 self-start">
                <TypingDots />
              </View>
            )}
          </ScrollView>
          <View style={[styles.composerContainer, { paddingBottom: insets.bottom - 20 }]}>
            <View style={[styles.composerWrapper, { height: composerHeight }]}>
              <KeyboardComposer
                placeholder="Tanya tentang hadis ini..."
                onSend={handleSendMessage}
                onStop={stop}
                onHeightChange={setComposerHeight}
                isStreaming={isLoading}
                minHeight={48}
                maxHeight={120}
                style={styles.composer}
              />
            </View>
          </View>
        </KeyboardAwareWrapper>

        {/* Error Message */}
        {error && (
          <View className="px-4 py-2 bg-red-50 border-t border-red-200">
            <Text className="text-red-600 text-sm">
              Ralat: {error.message}
            </Text>
          </View>
        )}

        {/* Keyboard Composer */}
        {/*<View style={styles.composerContainer}>*/}
        {/*  <View style={[styles.composerWrapper, { height: composerHeight }]}>*/}
        {/*    <KeyboardComposer*/}
        {/*      placeholder="Tanya tentang hadis ini..."*/}
        {/*      onSend={handleSendMessage}*/}
        {/*      onStop={stop}*/}
        {/*      onHeightChange={setComposerHeight}*/}
        {/*      isStreaming={isLoading}*/}
        {/*      minHeight={48}*/}
        {/*      maxHeight={120}*/}
        {/*      style={styles.composer}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    // paddingBottom is set dynamically in the component
  },
  composerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  composerWrapper: {
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
  },
  composer: {
    flex: 1,
  },
})
