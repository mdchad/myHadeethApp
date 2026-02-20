import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated from 'react-native-reanimated'
import { ChevronLeft, SearchIcon, ALargeSmallIcon, BookmarkIcon } from 'lucide-react-native'
import { withUniwind } from 'uniwind'

interface HadithDetailTopBarProps {
  animatedStyle: any
  onBackPress: () => void
  onSearchPress?: () => void
  onSettingsPress: () => void
  onBookmarkPress?: () => void
}

const StyledALargeSmallIcon = withUniwind(ALargeSmallIcon)
const StyledBookmarkIcon = withUniwind(BookmarkIcon)
const StyledSearchIcon = withUniwind(SearchIcon)
const StyledChevronLeft = withUniwind(ChevronLeft)

const ReadingTopBar: React.FC<HadithDetailTopBarProps> = ({
  animatedStyle,
  onBackPress,
  onSearchPress,
  onSettingsPress,
  onBookmarkPress
}) => {
  const insets = useSafeAreaInsets()

  return (
    <Animated.View
      style={[animatedStyle]}
      className="absolute top-0 left-0 right-0 z-50 bg-reading-background px-4"
    >
      <View
        style={{ paddingTop: insets.top + 20 }}
        className="border-b-2 border-reading-border flex flex-row justify-between pb-4"
      >
        <View className="flex flex-row">
          <Pressable className="flex flex-row" onPress={onBackPress}>
            <StyledChevronLeft className="text-reading-text" size={32} />
            {/*<Text className="text-xl text-reading-text">Back</Text>*/}
          </Pressable>
        </View>
        <View className="flex flex-row gap-2">
          {/*{onSearchPress && (*/}
          {/*  <Pressable onPress={onSearchPress}>*/}
          {/*    <StyledSearchIcon*/}
          {/*      className="text-reading-text"*/}
          {/*      size={28}*/}
          {/*      strokeWidth={2}*/}
          {/*    />*/}
          {/*  </Pressable>*/}
          {/*)}*/}
          <Pressable className="flex flex-row" onPress={onSettingsPress}>
            <StyledALargeSmallIcon
              className="text-reading-text"
              size={28}
              strokeWidth={2}
            />
          </Pressable>
          {onBookmarkPress && (
            <Pressable onPress={onBookmarkPress}>
              <StyledBookmarkIcon
                className="text-reading-text"
                size={28}
                strokeWidth={2}
              />
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

export default ReadingTopBar
