import Carousel from 'pinar';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

export interface CarouselItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
}

export interface CarouselProps {
  data: CarouselItem[];
  onItemPress?: (item: CarouselItem) => void;
}

const CarouselSlider: React.FC<CarouselProps> = ({data, onItemPress}) => {
  return (
    <View className="h-48">
      <Carousel
        loop
        autoplay
        dotStyle={{width: 6, height: 6}}
        activeDotStyle={{width: 24, height: 6}}>
        {data.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => onItemPress?.(item)}
            className="flex-1 px-4">
            <View className="flex-1 overflow-hidden rounded-2xl">
              <Image
                source={{uri: item.image}}
                className="absolute inset-0 w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <View className="absolute bottom-0 w-full p-4">
                <Text
                  className="text-xl font-bold text-white"
                  numberOfLines={1}>
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text
                    className="mt-1 text-sm text-white/90"
                    numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Carousel>
    </View>
  );
};

export default CarouselSlider;
