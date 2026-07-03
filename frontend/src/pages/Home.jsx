import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import '../styles/product.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const categories = ['Electronics', 'Home', 'Fashion', 'Accessories'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Featured products
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-banner hero-banner--home">
        <div className="hero-copy">
          <span className="hero-chip">New season collection</span>
          <h1>Shop smarter with curated essentials.</h1>
          <p>Discover polished everyday products, flash deals, and premium picks designed for a faster, cleaner shopping experience.</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn">Browse Products</Link>
            {!user ? (
              <Link to="/register" className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'none' }}>Create Account</Link>
            ) : (
              <Link to="/profile" className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'none' }}>My Profile</Link>
            )}
          </div>
        </div>
        
      </section>

      

      <section className="featured-section">
        <div className="section-heading">
          <span>Featured</span>
          <h2>Hand-picked products</h2>
        </div>
        {loading ? (
          <div className="page-message">Loading featured products...</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;