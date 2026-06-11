import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { WifiOffIcon, CircleAlertIcon, RotateCwIcon } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import SHARED_TEXT from '@/app/i18n'
import { isNetworkError } from '@/app/utils/api'

interface ErrorStateProps {
  /** The query/mutation error — used to pick the offline vs generic message. */
  error?: unknown
  /** Called when the user taps "Try Again" (e.g. react-query refetch). */
  onRetry?: () => void
  /** Extra classes for the outer container. */
  className?: string
}

/**
 * Shared offline/error fallback for screens whose data failed to load.
 * Distinguishes "you're offline" from "something broke" and offers a retry.
 */
export default function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation()
  const offline = isNetworkError(error)
  const Icon = offline ? WifiOffIcon : CircleAlertIcon

  return (
    <View className={`items-center justify-center px-8 py-12 gap-4 ${className ?? ''}`}>
      <Icon size={32} color="#1C2A4F" />
      <Text className="text-center text-royal-blue-950">
        {t(offline ? SHARED_TEXT.ERROR_OFFLINE_MESSAGE : SHARED_TEXT.ERROR_GENERIC_MESSAGE)}
      </Text>
      {onRetry && (
        <Pressable
          testID="error-retry"
          accessibilityRole="button"
          onPress={onRetry}
          className="flex-row items-center gap-2 bg-royal-blue-950 px-4 py-2 rounded-sm"
        >
          <RotateCwIcon size={14} color="white" />
          <Text className="text-white text-sm font-semibold">
            {t(SHARED_TEXT.ERROR_RETRY_LABEL)}
          </Text>
        </Pressable>
      )}
    </View>
  )
}
