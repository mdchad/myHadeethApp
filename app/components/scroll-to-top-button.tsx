import React from 'react';
import { Pressable } from 'react-native';
import { ArrowBigUp } from 'lucide-react-native';

interface ScrollToTopButtonProps {
  onPress: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ onPress }) => {
  return (
    <Pressable
      className="items-center absolute bottom-2 right-4 sticky bg-royal-blue-950 rounded-xl p-2"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      onPress={onPress}
    >
      <ArrowBigUp size={24} color={'white'} />
    </Pressable>
  );
};

export default ScrollToTopButton; 