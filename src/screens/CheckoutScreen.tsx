import {useNavigation} from '@react-navigation/native';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Shield,
  Wallet,
} from 'lucide-react-native';
import React, {useState} from 'react';
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

type PaymentMethod = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    title: 'Credit Card',
    description: 'Pay with Visa, Mastercard, or American Express',
    icon: <CreditCard size={24} color="#60a5fa" />,
    image: '',
  },
  {
    id: 'digital_wallet',
    title: 'Digital Wallet',
    description: 'Apple Pay, Google Pay, or PayPal',
    icon: <Wallet size={24} color="#60a5fa" />,
  },
];

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const {summary, clearCart} = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'success'>(
    'select',
  );

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setLoading(true);
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      setLoading(false);
      clearCart();
    }, 2000);
  };

  const PaymentHeader = () => (
    <View className="flex-row items-center justify-between p-4 border-b border-zinc-800">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="p-2 -ml-2">
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-white">Checkout</Text>
      <View style={{width: 28}} />
    </View>
  );

  const PaymentMethodCard = ({method}: {method: PaymentMethod}) => (
    <TouchableOpacity
      onPress={() => setSelectedMethod(method.id)}
      className={`p-4 mb-4 rounded-2xl border ${
        selectedMethod === method.id
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-zinc-700 bg-zinc-800'
      }`}>
      <View className="flex-row items-center">
        {method.icon}
        <View className="flex-1 ml-4">
          <Text className="font-semibold text-white">{method.title}</Text>
          <Text className="text-sm text-zinc-400">{method.description}</Text>
        </View>
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            selectedMethod === method.id ? 'border-blue-500' : 'border-zinc-600'
          }`}>
          {selectedMethod === method.id && (
            <View className="w-3 h-3 bg-blue-500 rounded-full" />
          )}
        </View>
      </View>
      {method.image && (
        <Image
          source={{uri: method.image}}
          className="h-8 mt-4 rounded-md bg-zinc-700"
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );

  const ProcessingView = () => (
    <View className="items-center justify-center flex-1 p-6">
      <ActivityIndicator size="large" color="#60a5fa" />
      <Text className="mt-4 text-lg font-semibold text-white">
        Processing Payment
      </Text>
      <Text className="mt-2 text-center text-zinc-400">
        Please wait while we process your payment...
      </Text>
    </View>
  );

  const SuccessView = () => (
    <View className="items-center justify-center flex-1 p-6">
      <View className="items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-500/20">
        <CheckCircle2 size={48} color="#22c55e" />
      </View>
      <Text className="mb-2 text-2xl font-bold text-white">
        Payment Successful!
      </Text>
      <Text className="mb-8 text-center text-zinc-400">
        Your order has been placed successfully. You'll receive a confirmation
        email shortly.
      </Text>
      <TouchableOpacity
        onPress={() => (navigation as any).navigate('Home')}
        className="px-8 py-4 bg-blue-500 rounded-xl">
        <Text className="font-semibold text-white">Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (step === 'processing') {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900">
        <PaymentHeader />
        <ProcessingView />
      </SafeAreaView>
    );
  }

  if (step === 'success') {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900">
        <SuccessView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <PaymentHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="mb-4 text-xl font-bold text-white">
            Payment Method
          </Text>

          {PAYMENT_METHODS.map(method => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}

          <View className="flex-row items-center p-4 mt-4 rounded-xl bg-zinc-800/50">
            <Shield size={20} color="#60a5fa" />
            <Text className="flex-1 ml-3 text-sm text-zinc-400">
              Your payment information is encrypted and secure
            </Text>
          </View>

          <View className="p-4 mt-6 rounded-xl bg-zinc-800">
            <Text className="mb-3 font-semibold text-white">Order Summary</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-zinc-400">Subtotal</Text>
                <Text className="text-white">
                  ${summary.subtotal.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-zinc-400">Total</Text>
                <Text className="font-bold text-white">
                  ${summary.total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 bg-zinc-900/95 backdrop-blur-lg">
        <TouchableOpacity
          onPress={handlePayment}
          disabled={!selectedMethod || loading}
          className={`py-4 rounded-xl flex-row justify-center items-center ${
            !selectedMethod || loading ? 'bg-blue-500/50' : 'bg-blue-500'
          }`}>
          <Text className="font-semibold text-white">
            Pay ${summary.total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
