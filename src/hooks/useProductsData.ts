import {useEffect, useState} from 'react';
import {fetchProducts} from '../services/api';

export const useProductsData = (limit = 10) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(limit);
        setProducts(data.products);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products',
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [limit]);

  return {products, loading, error};
};
