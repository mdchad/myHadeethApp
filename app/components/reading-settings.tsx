import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import { Pressable, Text, View } from 'react-native'
import {t} from "i18next";
import SHARED_TEXT from "../i18n";
import React, {useCallback, useMemo, useRef} from "react";
import {Portal} from "@gorhom/portal";
import { X } from 'lucide-react-native'
import { Slider as NSlider } from '@react-native-assets/slider'
import { useReadingSettingsStore } from '@/app/stores/useReadingSettingsStore'
import { Uniwind, useUniwind } from 'uniwind'
import * as Haptics from 'expo-haptics';

interface SheetProps {
  bottomSheetRef: React.RefObject<any>;
}

function ReadingSettingsSheet({ bottomSheetRef }: SheetProps) {
  const fontSizeIndex = useReadingSettingsStore((state) => state.fontSizeIndex)
  const setFontSizeIndex = useReadingSettingsStore((state) => state.setFontSizeIndex)
  const { theme } = useUniwind()

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], [])

  const themes = [
    { name: 'light', label: 'Light', preview: 'bg-white' },
    { name: 'sepia', label: 'Sepia', preview: 'bg-[#F4F1EA]' },
    { name: 'dark', label: 'Dark', preview: 'bg-gray-800' },
  ]

  // callbacks
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} pressBehavior={'close'} opacity={0.1} />
    ),
    []
  )

  return (
    <Portal hostName={'root'}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
      >
        <BottomSheetView style={{ padding: 10, paddingBottom: 20, height: '100%', display: 'flex', justifyContent: 'space-between' }}>
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
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                setFontSizeIndex(v)
              }}
              minimumTrackTintColor="#1C2A4F"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#1C2A4F"
              thumbStyle={{ width: 20, height: 20, borderRadius: 20, backgroundColor: "#1C2A4F" }}
            />

            <View className="flex flex-row justify-between items-center mt-4">
              <Text className="font-serif font-semibold text-base">A</Text>
              <Text className="font-serif font-semibold text-2xl">A</Text>
            </View>

            {/* Appearance */}
            <View className="mt-10">
              <Text className="text-lg font-semibold mb-4">Appearance</Text>
              <View className="flex flex-row w-full gap-2">
                {themes.map((t) => (
                  <Pressable
                    key={t.name}
                    onPress={() => Uniwind.setTheme(t.name as any)}
                    className={`flex-1 border-2 rounded-lg overflow-hidden ${
                      theme === t.name ? 'border-royal-blue-950' : 'border-gray-200'
                    }`}
                  >
                    <View className={`${t.preview} h-20`} />
                    <View className="p-3">
                      <Text className={`text-sm text-center font-semibold ${
                        theme === t.name ? 'text-royal-blue-950' : 'text-gray-700'
                      }`}>
                        {t.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}

export default ReadingSettingsSheet