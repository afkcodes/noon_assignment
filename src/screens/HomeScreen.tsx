import {useNavigation} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CarouselSlider, {CarouselItem} from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import {CAROUSEL_DATA} from '../data/data';
import {useProductsData} from '../hooks/useProductsData';
import LoadingProductCard from '../loaders/ProductLoader';
import {Product} from '../types/types';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation: any = useNavigation();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProductsData(10);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    setRefreshing(false);
  }, []);

  const handleCarouselPress = (item: CarouselItem) => {
    console.log('Carousel item pressed:', item.title);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetailScreen', {product});
  };

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product.title);
  };

  const handleFavorite = (product: Product) => {
    console.log('Favorite toggled:', product.title);
  };

  const renderLoadingProducts = () => (
    <View className="flex-row flex-wrap justify-between">
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <LoadingProductCard key={index} />
        ))}
    </View>
  );

  const renderError = (message: string) => (
    <View className="items-center justify-center flex-1 p-4">
      <Text className="mb-4 text-center text-red-400">{message}</Text>
      <TouchableOpacity
        className="px-4 py-2 bg-blue-500 rounded-full"
        onPress={onRefresh}>
        <Text className="text-white">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#60A5FA"
          />
        }>
        <View className="px-4 pt-2 pb-4">
          <Text className="text-2xl font-bold text-white">ShopApp</Text>
          <Text className="text-sm text-zinc-400">Welcome back!</Text>
        </View>

        <View className="mb-6">
          <CarouselSlider
            data={CAROUSEL_DATA}
            onItemPress={handleCarouselPress}
          />
        </View>

        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-white">
              Featured Products
            </Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-400">See All</Text>
            </TouchableOpacity>
          </View>
          {productsLoading ? (
            renderLoadingProducts()
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {products.map(product => (
                <ProductCard
                  key={(product as any).id}
                  product={product}
                  onPress={handleProductPress}
                  onFavorite={handleFavorite}
                />
              ))}
            </View>
          )}
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
