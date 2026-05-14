import React, { useRef, useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MessageItem, TypingDots } from '@/app/components/chat/message-item'
import { ToolCallItem } from '@/app/components/chat/tool-call-item'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { fetch as expoFetch } from 'expo/fetch'
import Page from '@/app/components/page'
import {
  KeyboardComposer,
  KeyboardAwareWrapper
} from '@launchhq/react-native-keyboard-composer'
import { ArrowLeft, PlusIcon } from 'lucide-react-native'
import { Button } from 'heroui-native'

const API_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/chat`
const USER_AGENT = 'MyWayApp/1.0.0'

const SUGGESTIONS = [
  'Berikan hadis-hadis tentang niat',
  'Hadis-hadis tentang kelebihan solat berjemaah',
  'Ceritakan hadis tentang sedekah',
  'Apa hadis tentang berbuat baik kepada ibu bapa?',
  'Hadis tentang kelebihan membaca Al-Quran',
  'Apakah hadis tentang sabar?',
]

export default function TanyaAIScreen() {
  const scrollViewRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [composerHeight, setComposerHeight] = useState(48)
  const [chatId, setChatId] = useState(0)

  const { messages, sendMessage, stop, error, status } = useChat({
    id: `tanya-${chatId}`,
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: API_ENDPOINT,
      headers: {
        'User-Agent': USER_AGENT
      }
    })
  })

  const handleNewConversation = () => {
    stop()
    setChatId(prev => prev + 1)
  }

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
          headerStyle: { backgroundColor: "#F2F2EA" },
          headerLeft: () => (
            <Button
              isIconOnly
              onPress={() => router.back()}
              size="sm"
              className="bg-white"
            >
              <ArrowLeft className="text-gray-500" />
            </Button>
          ),
          headerRight: () => (
            <Button
              isIconOnly
              onPress={handleNewConversation}
              size="sm"
              className="bg-white"
              isDisabled={messages.length === 0}
            >
              <PlusIcon size={20} className="text-gray-500" />
            </Button>
          ),
        }}
      />
      <View className="flex-1 bg-white dark:bg-gray-950">
        <KeyboardAwareWrapper
          style={styles.wrapper}
          extraBottomInset={composerHeight}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: composerHeight + 16 }
            ]}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.length === 0 && (
              <View className="flex-1 items-center justify-center px-8 py-16">
                <Text className="text-gray-400 text-center text-base">
                  Assalamualaikum! Saya sedia membantu anda menjawab soalan-soalan berkaitan Hadis.
                </Text>
              </View>
            )}
            {messages.map((message, index) => renderMessage(message, index))}
            {status === 'submitted' && (
              <View className="mx-4 my-2 p-4 rounded-2xl bg-gray-100 self-start">
                <TypingDots />
              </View>
            )}
          </ScrollView>
          <View
            style={[
              styles.composerContainer,
              { paddingBottom: insets.bottom - 20 }
            ]}
          >
            {messages.length === 0 && (
              <ScrollView
                horizontal
                directionalLockEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.chipsContent}
                style={styles.chips}
              >
                {SUGGESTIONS.map((s) => (
                  <Pressable key={s} onPress={() => handleSendMessage(s)} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </Pressable>
                ))}
              </ScrollView>
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
  chips: {
    height: 44,
    marginBottom: 8,
  },
  chipsContent: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
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
