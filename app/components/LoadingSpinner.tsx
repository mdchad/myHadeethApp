import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingSpinner; 