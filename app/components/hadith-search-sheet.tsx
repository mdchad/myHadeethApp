import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { Pressable, Text, TextInput, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Portal } from '@gorhom/portal'
import { X, ChevronUp, ChevronDown } from 'lucide-react-native'
import { withUniwind } from 'uniwind'

const StyledX = withUniwind(X)
const StyledChevronUp = withUniwind(ChevronUp)
const StyledChevronDown = withUniwind(ChevronDown)

interface SearchSheetProps {
  bottomSheetRef: React.RefObject<any>
  searchQuery: string
  onSearchChange: (text: string) => void
  currentIndex: number
  totalMatches: number
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
}

function HadithSearchSheet({
  bottomSheetRef,
  searchQuery,
  onSearchChange,
  currentIndex,
  totalMatches,
  onNext,
  onPrevious,
  onClose
}: SearchSheetProps) {
  // variables
  const snapPoints = useMemo(() => ['1%', '50%'], [])
  const [isOpen, setIsOpen] = useState(false)

  // callbacks
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} pressBehavior={'close'} opacity={0.1} />
    ),
    []
  )

  const handleClose = () => {
    bottomSheetRef.current?.close()
    onClose()
  }

  const handleSheetChange = useCallback((index: number) => {
    setIsOpen(index > 0)
  }, [])

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
        onClose={onClose}
        onChange={handleSheetChange}
      >
        <BottomSheetView
          style={{
            padding: 16,
            paddingBottom: 20,
            height: '100%'
          }}
        >
          {/* Header */}
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Search in Hadith</Text>
            <Pressable onPress={handleClose}>
              <StyledX className="text-gray-700" size={24} />
            </Pressable>
          </View>

          {/* Search Input */}
          <View className="flex flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-4">
            <TextInput
              className="flex-1 text-gray-900 text-base"
              placeholder="Enter keyword..."
              placeholderTextColor="#888"
              autoCorrect={false}
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              importantForAutofill="no"
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus={isOpen}
              returnKeyType="search"
            />
          </View>

          {/* Results & Navigation */}
          {searchQuery.length > 0 && (
            <View className="flex flex-row justify-between items-center">
              <View>
                <Text className="text-base text-gray-700">
                  {totalMatches === 0
                    ? 'No matches found'
                    : `${currentIndex + 1} of ${totalMatches} matches`}
                </Text>
              </View>

              {totalMatches > 0 && (
                <View className="flex flex-row gap-4">
                  <Pressable
                    onPress={onPrevious}
                    disabled={totalMatches === 0}
                    className="p-2 bg-gray-100 rounded-lg"
                  >
                    <StyledChevronUp
                      className="text-gray-700"
                      size={24}
                      opacity={totalMatches === 0 ? 0.3 : 1}
                    />
                  </Pressable>

                  <Pressable
                    onPress={onNext}
                    disabled={totalMatches === 0}
                    className="p-2 bg-gray-100 rounded-lg"
                  >
                    <StyledChevronDown
                      className="text-gray-700"
                      size={24}
                      opacity={totalMatches === 0 ? 0.3 : 1}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}

export default HadithSearchSheet
