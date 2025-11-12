import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  return (
    <View className="flex-1 justify-center items-center ">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingSpinner; 