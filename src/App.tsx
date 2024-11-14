import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStaticNavigation, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {House, Search, ShoppingCart} from 'lucide-react-native';
import React from 'react';
import {Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import '../global.css';
import {CartProvider} from './context/CartContext';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductScreen';
import SearchScreen from './screens/SearchScreen';

const HomeStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    HomeScreen: HomeScreen,
    ProductDetailScreen: ProductDetailScreen,
    CartScreen: CartScreen,
  },
});

const SearchStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    SearchScreen: SearchScreen,
    ProductDetailScreen: ProductDetailScreen,
    CartScreen: CartScreen,
  },
});

const CartStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    CartScreen: CartScreen,
    CheckoutScreen: CheckoutScreen,
  },
});

const RootStack = createBottomTabNavigator({
  screenOptions: ({route}) => {
    return {
      headerShown: false,
      tabBarActiveTintColor: '#E11D48',
      tabBarStyle: {
        backgroundColor: '#141414',
        borderTopWidth: 0,
        height: 56,
      },
      tabBarLabel: ({focused, color}) => {
        return (
          <Text
            className={`text-md mb-2 ${focused ? 'font-bold' : 'font-normal'}`}
            style={{color}}>
            {route.name}
          </Text>
        );
      },
    };
  },
  screens: {
    Home: {
      screen: HomeStack,
      options: {
        tabBarIcon: ({color, size}) => <House size={size} color={color} />,
      },
    },
    Search: {
      screen: SearchStack,
      options: {
        tabBarIcon: ({color, size}) => <Search size={size} color={color} />,
      },
    },
    Cart: {
      screen: CartStack,
      options: {
        tabBarIcon: ({color, size}) => (
          <ShoppingCart size={size} color={color} />
        ),
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <CartProvider>
        <Navigation theme={DarkTheme} />
      </CartProvider>
    </GestureHandlerRootView>
  );
};

export default App;
