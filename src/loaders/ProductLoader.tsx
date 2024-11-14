import React from 'react';
import {View} from 'react-native';

const LoadingProductCard = () => (
  <View className="bg-zinc-800 rounded-2xl w-[170px] h-[280px] mb-4 overflow-hidden">
    <View className="h-[170px] bg-zinc-700 animate-pulse" />
    <View className="p-3">
      <View className="w-16 h-3 mt-2 rounded bg-zinc-700 animate-pulse" />
      <View className="w-32 h-4 mt-2 rounded bg-zinc-700 animate-pulse" />
      <View className="w-20 h-3 mt-2 rounded bg-zinc-700 animate-pulse" />
      <View className="flex-row items-center justify-between pt-2">
        <View className="w-16 h-5 rounded bg-zinc-700 animate-pulse" />
        <View className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
      </View>
    </View>
  </View>
);

export default LoadingProductCard;
