import React from 'react'
import { Modal, Linking, Platform, ScrollView, View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Button } from 'heroui-native'

interface UpdateRequiredBlockerProps {
  visible: boolean
  currentVersion: string
  minimumVersion: string
  releaseNotes?: string | null
}

export function UpdateRequiredBlocker({
  visible,
  currentVersion,
  minimumVersion,
  releaseNotes,
}: UpdateRequiredBlockerProps) {
  const { t } = useTranslation()

  const handleUpdate = () => {
    const storeUrl =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id6478639621'
        : 'https://play.google.com/store/apps/details?id=com.mdchad.myWay'

    Linking.openURL(storeUrl)
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
        className="flex-1 bg-white"
      >
        {/* Icon/Illustration */}
        <View className="mb-8">
          <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center">
            <Text className="text-5xl">⚠️</Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
          {t('updateRequired.title') || 'Update Required'}
        </Text>

        {/* Description */}
        <Text className="text-base text-gray-600 text-center mb-6">
          {t('updateRequired.description') ||
            'This version is no longer supported. Please update to continue using the app.'}
        </Text>

        {/* Version Info */}
        <View className="bg-gray-50 rounded-lg p-4 w-full mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">
              {t('updateRequired.currentVersion') || 'Your Version'}:
            </Text>
            <Text className="text-sm font-semibold text-gray-900">
              {currentVersion}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">
              {t('updateRequired.minimumVersion') || 'Minimum Required'}:
            </Text>
            <Text className="text-sm font-semibold text-red-600">
              {minimumVersion}
            </Text>
          </View>
        </View>

        {/*/!* Release Notes *!/*/}
        {/*{releaseNotes && (*/}
        {/*  <View className="bg-blue-50 rounded-lg p-4 w-full mb-6">*/}
        {/*    <Text className="text-sm font-semibold text-blue-900 mb-2">*/}
        {/*      {t('updateRequired.whatsNew') || "What's New"}:*/}
        {/*    </Text>*/}
        {/*    <Text className="text-sm text-blue-800">{releaseNotes}</Text>*/}
        {/*  </View>*/}
        {/*)}*/}

        {/* Update Button */}
        <Button
          onPress={handleUpdate}
          size="lg"
          className="w-full bg-royal-blue"
        >
          {t('updateRequired.updateButton') || 'Update Now'}
        </Button>

        {/* Helper Text */}
        <Text className="text-xs text-gray-500 text-center mt-6">
          {t('updateRequired.helper') ||
            'You will be redirected to the app store'}
        </Text>
      </ScrollView>
    </Modal>
  )
}
