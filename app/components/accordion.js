import { View, Pressable, StyleSheet, Text } from 'react-native'
import { AnimateHeight } from './animate-height'
import { MotiView } from 'moti'
import { ChevronRight } from 'lucide-react-native'
import { useReducer } from 'react'

export default function Accordion({ title, children, itemKey }) {
  const [show, toggle] = useReducer((open) => !open, false)

  return (
    <View key={itemKey} className="bg-white rounded-xl mb-2">
      <Pressable
        onPress={toggle}
        className="flex flex-row p-4 items-center justify-between"
      >
        <Text
          selectable={false}
          className="text-lg font-semibold text-gray-800"
        >
          {title}
        </Text>
        <MotiView
          animate={{
            rotateZ: show ? '-90deg' : '0deg'
          }}
        >
          <ChevronRight color="black" size={17} />
        </MotiView>
      </Pressable>
      <AnimateHeight enterFrom="bottom" hide={!show}>
        <View className="p-2">
          <Text className="text-gray-800">{children}</Text>
        </View>
      </AnimateHeight>
    </View>
  )
}
