import { View, Text, Pressable } from 'react-native'
import { Slider as NSlider } from '@react-native-assets/slider'
import { useState, useEffect } from 'react'
import { storage } from '@/app/shared/storage'
import { useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function Settings() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [fontSizeIndex, setFontSizeIndex] = useState(3)

  // Load font size from storage on mount
  useEffect(() => {
    const savedFontSize = storage.getNumber('hadith-font-size')
    if (savedFontSize !== undefined) {
      setFontSizeIndex(savedFontSize)
    }
  }, [])

  // Save font size to storage whenever it changes
  const handleFontSizeChange = (value: number) => {
    setFontSizeIndex(value)
    storage.set('hadith-font-size', value)
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 16 }}
        className="px-4 pb-4 border-b border-gray-200"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold">Reading Settings</Text>
          <Pressable onPress={() => router.back()}>
            <X size={28} color="black" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View className="p-6">
        <Text className="text-lg font-semibold mb-4">Font Size</Text>

        <NSlider
          enabled={true}
          slideOnTap={true}
          minimumValue={0}
          trackStyle={{ height: 4, backgroundColor: "#E5E7EB" }}
          step={1}
          maximumValue={4}
          value={fontSizeIndex}
          onValueChange={handleFontSizeChange}
          minimumTrackTintColor="#1C2A4F"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#1C2A4F"
          thumbStyle={{ width: 20, height: 20, borderRadius: 20, backgroundColor: "#1C2A4F" }}
        />

        <View className="flex flex-row justify-between items-center mt-4">
          <Text className="font-serif font-semibold text-base">A</Text>
          <Text className="font-serif font-semibold text-2xl">A</Text>
        </View>

        {/* Preview text */}
        <View className="mt-8 p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-600 mb-2">Preview</Text>
          <Text
            className={`text-gray-800 ${
              fontSizeIndex === 0 ? 'text-xs' :
              fontSizeIndex === 1 ? 'text-sm' :
              fontSizeIndex === 2 ? 'text-base' :
              fontSizeIndex === 3 ? 'text-lg' :
              'text-xl'
            }`}
          >
            This is how your text will look
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Settings