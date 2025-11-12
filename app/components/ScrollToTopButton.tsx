import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ArrowBigUp } from 'lucide-react-native';

interface ScrollToTopButtonProps {
  onPress: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="items-center absolute bottom-2 right-4 sticky bg-royal-blue rounded-xl p-2"
      onPress={onPress}
    >
      <ArrowBigUp size={24} color={'white'} />
    </TouchableOpacity>
  );
};

export default ScrollToTopButton; 