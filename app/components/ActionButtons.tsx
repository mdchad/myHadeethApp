import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Bookmark, Share2 } from 'lucide-react-native';

interface ActionButtonsProps {
  onShare: () => void;
  onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onShare, onSave }) => {
  return (
    <View className="flex flex-row justify-end items-center bg-royal-blue p-1">
      <TouchableHighlight
        className="p-1"
        underlayColor="#333"
        onPress={onShare}
      >
        <Share2 color="white" absoluteStrokeWidth={2} size={18} />
      </TouchableHighlight>
      <TouchableHighlight
        className="p-1"
        underlayColor="#333"
        onPress={onSave}
      >
        <Bookmark color="white" absoluteStrokeWidth={2} size={18} />
      </TouchableHighlight>
    </View>
  );
};

export default ActionButtons; 