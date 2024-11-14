export interface CartItem extends Product {
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  total: number;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {Product} from '../types/types';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

type CartAction =
  | {type: 'SET_ITEMS'; payload: CartItem[]}
  | {type: 'ADD_ITEM'; payload: Product}
  | {type: 'REMOVE_ITEM'; payload: number}
  | {type: 'UPDATE_QUANTITY'; payload: {id: number; quantity: number}}
  | {type: 'CLEAR_CART'};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [items, dispatch] = useReducer(
    (state: CartItem[], action: CartAction): CartItem[] => {
      switch (action.type) {
        case 'SET_ITEMS':
          return action.payload;

        case 'ADD_ITEM':
          const existingItem = state.find(
            item => item.id === action.payload.id,
          );
          if (existingItem) {
            return state.map(item =>
              item.id === action.payload.id
                ? {...item, quantity: item.quantity + 1}
                : item,
            );
          }
          return [...state, {...action.payload, quantity: 1}];

        case 'REMOVE_ITEM':
          return state.filter(item => item.id !== action.payload);

        case 'UPDATE_QUANTITY':
          return state.map(item =>
            item.id === action.payload.id
              ? {...item, quantity: action.payload.quantity}
              : item,
          );

        case 'CLEAR_CART':
          return [];

        default:
          return state;
      }
    },
    [],
  );

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          dispatch({type: 'SET_ITEMS', payload: JSON.parse(savedCart)});
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };
    saveCart();
  }, [items]);

  // Calculate cart summary
  const calculateSummary = (): CartSummary => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + item.price * (1 - item.discountPercentage / 100) * item.quantity,
      0,
    );

    return {
      subtotal,
      total: subtotal,
    };
  };

  const value: CartContextType = {
    items,
    summary: calculateSummary(),
    addItem: product => dispatch({type: 'ADD_ITEM', payload: product}),
    removeItem: productId =>
      dispatch({type: 'REMOVE_ITEM', payload: productId}),
    updateQuantity: (productId, quantity) => {
      if (quantity > 0) {
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: {id: productId, quantity},
        });
      } else {
        dispatch({type: 'REMOVE_ITEM', payload: productId});
      }
    },
    clearCart: () => dispatch({type: 'CLEAR_CART'}),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
