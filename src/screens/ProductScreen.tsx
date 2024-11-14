import {useNavigation} from '@react-navigation/native';
import {
  Minus,
  Plus,
  Shield,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react-native';
import Pinar from 'pinar';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCart} from '../context/CartContext';
import {Product} from '../types/types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface ProductDetailProps {
  route: {
    params: {
      product: Product;
    };
  };
  navigation: any;
}

const ProductDetailScreen: React.FC<ProductDetailProps> = ({route}) => {
  const navigation = useNavigation();
  const {product} = route.params;
  const {addItem, items, updateQuantity} = useCart();

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const cartItem = items.find(item => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  const renderFeatureBox = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
  ) => (
    <View className="flex-1 p-4 bg-zinc-800/50 rounded-2xl">
      <View className="items-center">
        {icon}
        <Text className="mt-2 font-medium text-white">{title}</Text>
        <Text className="mt-1 text-xs text-center text-zinc-400">
          {subtitle}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-zinc-900">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View className="h-[450px] bg-zinc-800">
          <Pinar loop={false}>
            {product.images.map((image, index) => (
              <View key={index} className="flex-1">
                <Image
                  source={{uri: image}}
                  className="flex-1"
                  resizeMode="cover"
                />
              </View>
            ))}
          </Pinar>
        </View>

        <View className="px-6 pt-6 pb-32">
          {/* Brand and Title */}
          <View className="space-y-2">
            <Text className="text-base font-medium text-zinc-400">
              {product.brand}
            </Text>
            <Text className="text-2xl font-bold text-white">
              {product.title}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center">
              <Star size={20} color="#FBBF24" fill="#FBBF24" />
              <Text className="ml-2 text-base text-white">
                {product.rating}
              </Text>
              <Text className="ml-2 text-zinc-400">
                ({Math.floor(Math.random() * 1000)} reviews)
              </Text>
            </View>
            <Text
              className={`${
                product.stock > 50 ? 'text-green-500' : 'text-orange-500'
              }`}>
              {product.stock} in stock
            </Text>
          </View>

          {/* Price Card */}
          <View className="p-6 mt-6 bg-zinc-800 rounded-2xl">
            <View className="flex-row items-baseline">
              <Text className="text-3xl font-bold text-white">
                ${discountedPrice.toFixed(2)}
              </Text>
              {product.discountPercentage > 0 && (
                <View className="ml-4">
                  <Text className="text-lg line-through text-zinc-400">
                    ${product.price}
                  </Text>
                </View>
              )}
            </View>
            {product.discountPercentage > 0 && (
              <View className="mt-2">
                <Text className="font-semibold text-green-500">
                  Save {product.discountPercentage}% right now
                </Text>
              </View>
            )}
          </View>

          {/* Features Grid */}
          <View className="flex-row gap-4 mt-6">
            {renderFeatureBox(
              <Truck size={24} color="#60A5FA" />,
              'Free Delivery',
              'Orders over $100',
            )}
            {renderFeatureBox(
              <Shield size={24} color="#60A5FA" />,
              '1 Year Warranty',
              'Full coverage',
            )}
          </View>

          {/* Description */}
          <View className="mt-8">
            <Text className="mb-4 text-xl font-bold text-white">
              About the product
            </Text>
            <Text className="text-base leading-6 text-zinc-400">
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-zinc-900/95 backdrop-blur-lg">
        <SafeAreaView edges={['bottom']}>
          <View className="px-6 py-4">
            {currentQuantity > 0 ? (
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center bg-zinc-800 rounded-xl">
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(product.id, currentQuantity - 1)
                    }
                    className="p-4"
                    disabled={currentQuantity <= 0}>
                    <Minus
                      size={20}
                      color={currentQuantity <= 0 ? '#52525b' : '#fff'}
                    />
                  </TouchableOpacity>
                  <Text className="px-6 text-lg font-semibold text-white">
                    {currentQuantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(product.id, currentQuantity + 1)
                    }
                    className="p-4"
                    disabled={currentQuantity >= product.stock}>
                    <Plus
                      size={20}
                      color={
                        currentQuantity >= product.stock ? '#52525b' : '#fff'
                      }
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  className="flex-row items-center px-6 py-4 bg-blue-500 rounded-xl">
                  <Text className="mr-2 font-semibold text-white">
                    View Cart
                  </Text>
                  <Text className="font-semibold text-white">
                    ${(discountedPrice * currentQuantity).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Add to Cart and Buy Now buttons
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => addItem(product)}
                  className="flex-row items-center justify-center flex-1 py-4 bg-zinc-800 rounded-2xl">
                  <ShoppingBag size={20} color="#fff" />
                  <Text className="ml-2 text-base font-semibold text-white">
                    Add to Cart
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    addItem(product);
                    navigation.navigate('Cart');
                  }}
                  className="flex-1 py-4 bg-blue-500 rounded-2xl">
                  <Text className="text-base font-semibold text-center text-white">
                    Buy Now
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
