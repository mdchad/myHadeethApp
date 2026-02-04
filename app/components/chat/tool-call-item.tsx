import React from 'react'
import { View, Text } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SearchIcon } from 'lucide-react-native'

interface ToolCallItemProps {
  toolName: string
  args?: any
  result?: any
}

export function ToolCallItem({ toolName, args, result }: ToolCallItemProps) {
  const resultCount = result?.results?.length || result?.count || 0

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="mx-4 my-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
      style={{ maxWidth: '80%', alignSelf: 'flex-start' }}
    >
      <View className="flex-row items-center gap-2">
        <SearchIcon size={16} color="#3B82F6" />
        <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
          {getToolDisplayName(toolName)}
        </Text>
      </View>

      {args?.query && (
        <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          "{args.query}"
        </Text>
      )}

      {result && (
        <Text className="text-gray-500 dark:text-gray-500 text-xs mt-2">
          Found {resultCount} hadith{resultCount !== 1 ? 's' : ''}
        </Text>
      )}
    </Animated.View>
  )
}

function getToolDisplayName(toolName: string): string {
  const displayNames: Record<string, string> = {
    searchHadith: 'Searching hadiths...',
    search_hadith: 'Searching hadiths...',
  }
  return displayNames[toolName] || `Using ${toolName}...`
}
