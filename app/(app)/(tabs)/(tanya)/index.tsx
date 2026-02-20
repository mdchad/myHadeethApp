import React, { useRef, useEffect, useState } from 'react'
import { View, Text, ScrollView, FlatList, StyleSheet, Pressable } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MessageItem } from '@/app/components/chat/message-item'
import { ToolCallItem } from '@/app/components/chat/tool-call-item'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { fetch as expoFetch } from 'expo/fetch'
import Page from '@/app/components/page'
import {
  KeyboardComposer,
  KeyboardAwareWrapper
} from '@launchhq/react-native-keyboard-composer'
import { ArrowLeft } from 'lucide-react-native'
import { Button } from 'heroui-native'

const API_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/chat`
const USER_AGENT = 'MyWayApp/1.0.0'

const SUGGESTIONS = [
  'Apakah hadis tentang niat?',
  'Hadis tentang kelebihan solat berjemaah',
  'Ceritakan hadis tentang sedekah',
  'Apa hadis tentang berbuat baik kepada ibu bapa?',
  'Hadis tentang kelebihan membaca Al-Quran',
  'Apakah hadis tentang sabar?',
]

const SUGGESTIONS_HEIGHT = 52

export default function TanyaAIScreen() {
  const scrollViewRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [composerHeight, setComposerHeight] = useState(48)

  const { messages, sendMessage, stop, error, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: API_ENDPOINT,
      headers: {
        'User-Agent': USER_AGENT
      }
    })
  })

  const isLoading = status === 'streaming' || status === 'submitted'

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

    const parts = item.parts || []
    const elements: any[] = []

    parts.forEach((part: any, partIndex: number) => {
      if (part.type === 'text') {
        elements.push(
          <MessageItem
            key={`${item.id}-text-${partIndex}`}
            role={item.role}
            content={part.text}
            isStreaming={isStreaming && partIndex === parts.length - 1}
          />
        )
      } else if (part.type === 'tool-call') {
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

    if (elements.length > 0) {
      return <View key={item.id}>{elements}</View>
    }

    return null
  }

  return (
    <Page className="bg-white">
      <Stack.Screen
        options={{
          title: 'Tanya AI',
          headerLeft: () => (
            <Button
              isIconOnly
              onPress={() => router.back()}
              size="sm"
              className="bg-white"
            >
              <ArrowLeft className="text-gray-500" />
            </Button>
          )
        }}
      />
      <View className="flex-1 bg-white dark:bg-gray-950">
        {/* Empty state */}
        {messages.length === 0 && (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-gray-400 text-center text-base">
              Assalamualaikum! Saya sedia membantu anda menjawab soalan-soalan
              berkaitan Islam.
            </Text>
          </View>
        )}

        {/* Messages List with Keyboard Aware Wrapper */}
        <KeyboardAwareWrapper
          style={styles.wrapper}
          extraBottomInset={composerHeight + (messages.length === 0 ? SUGGESTIONS_HEIGHT : 0)}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: composerHeight + (messages.length === 0 ? SUGGESTIONS_HEIGHT : 0) + 16 }
            ]}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message, index) => renderMessage(message, index))}
          </ScrollView>
          <View
            style={[
              styles.composerContainer,
              { paddingBottom: insets.bottom - 20 }
            ]}
          >
            {messages.length === 0 && (
              <FlatList
                horizontal
                data={SUGGESTIONS}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.suggestionsContent}
                style={styles.suggestions}
                renderItem={({ item }) => (
                  <Pressable onPress={() => handleSendMessage(item)} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </Pressable>
                )}
              />
            )}
            <View style={[styles.composerWrapper, { height: composerHeight }]}>
              <KeyboardComposer
                placeholder="Tanya soalan anda di sini..."
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
            <Text className="text-red-600 text-sm">Ralat: {error.message}</Text>
          </View>
        )}
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 16
  },
  composerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16
  },
  suggestions: {
    height: SUGGESTIONS_HEIGHT - 8,
    marginBottom: 8,
  },
  suggestionsContent: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
  },
  chip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  chipText: {
    fontSize: 13,
    color: '#3C3C43',
  },
  composerWrapper: {
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden'
  },
  composer: {
    flex: 1
  }
})
