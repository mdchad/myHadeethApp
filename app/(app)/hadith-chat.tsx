import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { SendIcon, XIcon } from 'lucide-react-native'
import { MessageItem } from '@/app/components/chat/message-item'
import { ToolCallItem } from '@/app/components/chat/tool-call-item'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { fetch as expoFetch } from 'expo/fetch'

const API_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/chat`
const USER_AGENT = 'MyWayApp/1.0.0'

export default function HadithChatScreen() {
  const params = useLocalSearchParams()
  const flatListRef = useRef<FlatList>(null)
  const inputRef = useRef<TextInput>(null)

  // Extract hadith context from params and reconstruct hadith object
  const hadith = {
    _id: params.hadithId as string,
    number: params.hadithNumber as string,
    book_title: {
      ms: params.bookTitle as string || 'Unknown',
    },
    content: [
      {
        ar: params.contentAr as string,
        ms: params.contentMs as string,
      },
    ],
  }

  // Local state for input (AI SDK 5.0 no longer manages input state)
  const [input, setInput] = useState('')

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
    onFinish: () => {
      Keyboard.dismiss()
    },
  })

  // Derive loading state from status
  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const messageText = input.trim()
    setInput('') // Clear input immediately for better UX

    try {
      await sendMessage({ text: messageText })
    } catch (err) {
      // Error is handled by useChat's error state
      console.error('Failed to send message:', err)
    }
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLastMessage = index === messages.length - 1
    const isStreaming = isLastMessage && isLoading && item.role === 'assistant'

    // Extract parts from the message
    const parts = item.parts || []
    const elements: JSX.Element[] = []

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
      return <>{elements}</>
    }

    // Fallback for empty messages
    return null
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <Stack.Screen
        options={{
          title: `Hadith ${hadith.number}`,
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />

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

      {/* Messages List */}
      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-400 dark:text-gray-600 text-center text-base">
            Tanya saya apa-apa tentang hadis ini
          </Text>
          <Text className="text-gray-300 dark:text-gray-700 text-center text-sm mt-2">
            Saya boleh membantu menerangkan maksud, konteks, atau mencari hadis yang berkaitan
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="pt-4 pb-4"
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {/* Error Message */}
      {error && (
        <View className="px-4 py-2 bg-red-50 border-t border-red-200">
          <Text className="text-red-600 text-sm">
            Ralat: {error.message}
          </Text>
        </View>
      )}

      {/* Composer */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          {isLoading && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              className="mb-2"
            >
              <TouchableOpacity
                onPress={stop}
                className="self-start px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full flex-row items-center gap-2"
              >
                <XIcon size={14} color="#6B7280" />
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hentikan
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View className="flex-row items-end gap-2">
            <View className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholder="Tanya tentang hadis ini..."
                placeholderTextColor="#9CA3AF"
                multiline
                className="text-gray-900 dark:text-gray-100 text-base max-h-32"
                style={{ minHeight: 20 }}
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-full ${
                input.trim() && !isLoading
                  ? 'bg-royal-blue'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <SendIcon
                size={20}
                color={input.trim() && !isLoading ? 'white' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
