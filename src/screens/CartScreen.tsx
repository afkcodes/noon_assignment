import {useNavigation} from '@react-navigation/native';
import {ArrowLeft, Minus, Plus, ShoppingBag, Trash2} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCart} from '../context/CartContext';

const CartScreen = () => {
  const navigation = useNavigation();
  const {items, summary, updateQuantity, removeItem} = useCart();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (navigation as any).navigate('CheckoutScreen');
    }, 1000);
  };

  const CartHeader = () => (
    <View className="flex-row items-center justify-between p-4 border-b border-zinc-800">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="p-2 -ml-2">
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-white">
        Shopping Cart ({items.length})
      </Text>
      <View style={{width: 28}} />
    </View>
  );

  const CartItem = ({item}: any) => {
    const discountedPrice = item.price * (1 - item.discountPercentage / 100);

    return (
      <View className="p-4 mb-4 bg-zinc-800/50 rounded-2xl">
        <View className="flex-row">
          <Image
            source={{uri: item.thumbnail}}
            className="w-24 h-24 rounded-xl bg-zinc-700"
            resizeMode="cover"
          />

          <View className="flex-1 ml-4">
            <View className="flex-row justify-between">
              <View className="flex-1 mr-4">
                <Text
                  className="mb-1 font-semibold text-white"
                  numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                className="p-2 -mt-2 -mr-2">
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {/* Price */}
            <View className="flex-row items-baseline mt-1">
              <Text className="text-base font-semibold text-white">
                ${discountedPrice.toFixed(2)}
              </Text>
              {item.discountPercentage > 0 && (
                <Text className="ml-2 text-sm line-through text-zinc-400">
                  ${item.price.toFixed(2)}
                </Text>
              )}
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center mt-3">
              <View className="flex-row items-center rounded-lg bg-zinc-700">
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2"
                  disabled={item.quantity <= 1}>
                  <Minus
                    size={16}
                    color={item.quantity <= 1 ? '#52525b' : '#fff'}
                  />
                </TouchableOpacity>
                <Text className="text-white px-4 min-w-[40px] text-center">
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2">
                  <Plus size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const CartSummary = () => (
    <View className="p-4 bg-zinc-800 rounded-2xl">
      <View className="space-y-3">
        <View className="flex-row justify-between">
          <Text className="text-zinc-400">Subtotal</Text>
          <Text className="text-white">${summary.subtotal.toFixed(2)}</Text>
        </View>
        <View className="h-px bg-zinc-700" />
        <View className="flex-row justify-between">
          <Text className="font-bold text-white">Total</Text>
          <Text className="text-lg font-bold text-white">
            ${summary.total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const EmptyCart = () => (
    <View className="items-center justify-center flex-1 p-6">
      <View className="p-6 mb-6 rounded-full bg-zinc-800/50">
        <ShoppingBag size={48} color="#60a5fa" />
      </View>
      <Text className="mb-2 text-xl font-bold text-white">
        Your cart is empty
      </Text>
      <Text className="mb-8 text-center text-zinc-400">
        Looks like you haven't added any items to your cart yet.
      </Text>
      <TouchableOpacity
        onPress={() => (navigation as any).navigate('Home')}
        className="px-6 py-3 bg-blue-500 rounded-xl">
        <Text className="font-semibold text-white">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900">
        <CartHeader />
        <EmptyCart />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <CartHeader />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}

        <View className="mt-2 mb-24">
          <CartSummary />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-900/95 backdrop-blur-lg">
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={loading}
          className={`
            py-4 rounded-2xl flex-row justify-center items-center
            ${loading ? 'bg-blue-500/70' : 'bg-blue-500'}
          `}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">
              Proceed to Checkout (${summary.total.toFixed(2)})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
