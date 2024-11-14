import {Heart, Star} from 'lucide-react-native';
import React, {useState} from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {Product} from '../types/types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onFavorite: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite(product);
  };

  return (
    <Pressable
      onPress={() => onPress(product)}
      className="bg-zinc-800 rounded-2xl w-[170px] mb-4 overflow-hidden">
      <View className="relative">
        <Image
          source={{uri: product.thumbnail}}
          className="h-[170px] w-full bg-zinc-700"
        />

        {product.discountPercentage > 0 && (
          <View className="absolute top-2 left-2 bg-blue-500 px-2.5 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">
              -{product.discountPercentage.toFixed(0)}%
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? 'bg-red-500' : 'bg-black/50'
          }`}>
          <Heart size={16} color="#fff" fill={isFavorite ? '#fff' : 'none'} />
        </TouchableOpacity>

        {product.stock < 10 && (
          <View className="absolute px-2 py-1 rounded-full bottom-2 left-2 bg-red-500/90">
            <Text className="text-xs text-white">
              Only {product.stock} left
            </Text>
          </View>
        )}
      </View>

      <View className="p-3 space-y-1">
        <Text className="text-xs font-medium text-zinc-400">
          {product.brand}
        </Text>

        <Text numberOfLines={1} className="text-sm font-semibold text-white">
          {product.title}
        </Text>

        <View className="flex-row items-center">
          <Star size={12} color="#FBBF24" fill="#FBBF24" />
          <Text className="ml-1 text-xs font-medium text-white">
            {product.rating}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-1">
          <View>
            <Text className="font-bold text-white">${discountedPrice}</Text>
            {product.discountPercentage > 0 && (
              <Text className="text-xs line-through text-zinc-400">
                ${product.price}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;
