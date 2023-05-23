import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { AnimateHeight } from './animate-height';
import { MotiView } from 'moti';
import Constants from 'expo-constants';
import {ChevronRight} from "lucide-react-native";

export default function Accordion({ title, children, key }) {
  const [show, toggle] = React.useReducer((open) => !open, false);

  return (
    <View key={key} className="bg-white rounded-xl mb-2">
      <Pressable onPress={toggle} className="flex flex-row p-4 items-center justify-between">
        <Text selectable={false} className="text-lg font-semibold text-gray-800">
          {title}
        </Text>
        <MotiView
          animate={{
            rotateZ: show ? '-90deg' : '0deg',
          }}>
          <ChevronRight color="black" size={17} />
        </MotiView>
      </Pressable>
      <AnimateHeight enterFrom="bottom" hide={!show}>
        <View className="p-2">
          <Text className="text-gray-800">
            {children}
          </Text>
        </View>
      </AnimateHeight>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  question: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answer: {
    padding: 16,
    marginTop: -16
  },
  answerText: {
    color: '#A09FA5',
    lineHeight: 20
  },
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#232326',
  },
  questionText: {
    color: '#EDEDEE',
    fontWeight: 'bold',
  },
});