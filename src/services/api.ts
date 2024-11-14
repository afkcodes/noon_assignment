import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

export const fetchProducts = async (limit = 10, skip = 0) => {
  try {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
