import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import { Pressable, Text, TouchableHighlight, View } from 'react-native'
import {t} from "i18next";
import SHARED_TEXT from "../i18n";
import React, {useCallback, useMemo, useRef} from "react";
import {Portal} from "@gorhom/portal";
import { X } from 'lucide-react-native'
import { Slider as NSlider } from '@react-native-assets/slider'
import { useReadingSettingsStore } from '@/app/stores/useReadingSettingsStore'

interface SheetProps {
  bottomSheetRef: React.RefObject<any>;
}

function ReadingSettingsSheet({ bottomSheetRef }: SheetProps) {
  const fontSizeIndex = useReadingSettingsStore((state) => state.fontSizeIndex)
  const setFontSizeIndex = useReadingSettingsStore((state) => state.setFontSizeIndex)
  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], [])

  // callbacks
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} pressBehavior={'close'} opacity={0.1} />
    ),
    []
  )

  function selectBooks() {
    bottomSheetRef.current.close()
  }

  return (
    <Portal hostName={'root'}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ padding: 10, paddingBottom: 20, height: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <View
            className="px-4 pt-8 pb-4 border-b border-gray-200"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold">Reading Settings</Text>
              {/*<Pressable onPress={() => router.back()}>*/}
                <X size={28} color="black" />
              {/*</Pressable>*/}
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
              onValueChange={setFontSizeIndex}
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
            <View className="flex flex-row w-full mt-10">
              <Pressable className="w-1/3 border border-gray-200 p-2">
                <Text className="text-lg font-semibold mb-4 mt-8 text-center">Light</Text>
              </Pressable>
              <Pressable className="w-1/3 border border-gray-200 p-2">
                <Text className="text-lg font-semibold mb-4 mt-8 text-center">Sepia</Text>
              </Pressable>
              <Pressable className="w-1/3 border border-gray-200 p-2">
                <Text className="text-lg font-semibold mb-4 mt-8 text-center">Dark</Text>
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}

export default ReadingSettingsSheet