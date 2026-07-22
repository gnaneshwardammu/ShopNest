import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../services/api';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch('/api/products');
        if (!res.ok) {
          throw new Error(`Unable to load products (${res.status})`);
        }
        const data = await res.json();
        console.log('Products response:', res);
        console.log('Products data:', data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setError('Unable to load products. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      <input 
        type="text" 
        placeholder="Search products..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {filteredProducts.length === 0 && <div>No products found.</div>}
        </div>
      )}
    </div>
  );
};

export default Shop;
