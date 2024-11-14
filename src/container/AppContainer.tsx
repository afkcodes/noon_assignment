import React from 'react';
import {View} from 'react-native';

const AppContainer = ({children}: {children: React.ReactNode}) => {
  return <View className="flex-1 bg-gray-950">{children}</View>;
};

export default AppContainer;
