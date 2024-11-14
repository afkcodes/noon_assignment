import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {debounce} from 'lodash';
import {
  ChevronRight,
  History,
  Search,
  Star,
  TrendingUp,
  X,
} from 'lucide-react-native';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DUMMY_TRENDING} from '../data/data';
import {Product} from '../types/types';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${query}`,
      );
      setSearchResults(response.data.products);
    } catch (err) {
      setError('Failed to fetch results');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => fetchSearchResults(query), 500),
    [],
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleProductPress = (product: Product) => {
    const updatedRecent = [
      searchQuery,
      ...recentSearches.filter(item => item !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updatedRecent);

    (navigation as any).navigate('ProductDetailScreen', {product});
  };

  const handleTrendingPress = (query: string) => {
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const SearchResult = ({item}: {item: Product}) => {
    const discountedPrice = item.price * (1 - item.discountPercentage / 100);

    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item)}
        className="flex-row items-center p-4 mb-3 bg-zinc-800 rounded-xl">
        <Image
          source={{uri: item.thumbnail}}
          className="w-20 h-20 rounded-lg bg-zinc-700"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <Text className="font-medium text-white" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="mt-1 text-sm text-zinc-400" numberOfLines={1}>
            {item.brand}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="font-bold text-white">
              ${discountedPrice.toFixed(2)}
            </Text>
            {item.discountPercentage > 0 && (
              <Text className="ml-2 text-sm line-through text-zinc-400">
                ${item.price}
              </Text>
            )}
          </View>
          <View className="flex-row items-center mt-1">
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <Text className="ml-1 text-xs text-zinc-400">{item.rating}</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#71717a" />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 p-4">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View className="mb-6">
          <Text className="mb-3 font-semibold text-white">Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTrendingPress(search)}
              className="flex-row items-center py-3">
              <History size={16} color="#71717a" />
              <Text className="ml-3 text-zinc-300">{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View>
        <Text className="mb-3 font-semibold text-white">Trending Searches</Text>
        <View className="flex-row flex-wrap gap-2">
          {DUMMY_TRENDING.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTrendingPress(item)}
              className="flex-row items-center px-4 py-2 rounded-full bg-zinc-800">
              <TrendingUp size={14} color="#60a5fa" />
              <Text className="ml-2 text-sm text-white">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <View className="p-4">
        <View className="flex-row items-center px-4 py-2 bg-zinc-800 rounded-xl">
          <Search size={20} color="#71717a" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search products..."
            placeholderTextColor="#71717a"
            className="flex-1 ml-3 text-white"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-2 -mr-2">
              <X size={20} color="#71717a" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {loading && (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#60a5fa" />
        </View>
      )}

      {error && (
        <View className="items-center justify-center flex-1 p-4">
          <Text className="text-center text-red-500">{error}</Text>
          <TouchableOpacity
            onPress={() => fetchSearchResults(searchQuery)}
            className="px-6 py-3 mt-4 bg-blue-500 rounded-full">
            <Text className="font-medium text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={searchResults}
          renderItem={({item}) => <SearchResult item={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerClassName="px-4"
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
