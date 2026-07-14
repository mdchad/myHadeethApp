import React from 'react';
import { View, Pressable } from 'react-native';
import { Bookmark, Share2 } from 'lucide-react-native';

interface ActionButtonsProps {
  onShare: () => void;
  onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onShare, onSave }) => {
  return (
    <View className="flex flex-row justify-end items-center bg-royal-blue-950 p-1">
      <Pressable
        className="p-1"
        style={({ pressed }) => pressed && { backgroundColor: '#333' }}
        onPress={onShare}
      >
        <Share2 color="white" strokeWidth={2} size={18} />
      </Pressable>
      <Pressable
        className="p-1"
        style={({ pressed }) => pressed && { backgroundColor: '#333' }}
        onPress={onSave}
      >
        <Bookmark color="white" strokeWidth={2} size={18} />
      </Pressable>
    </View>
  );
};

export default ActionButtons; 