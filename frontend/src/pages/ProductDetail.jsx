import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useContext } from 'react';
import "../styles/product.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { showModal } = useNotification();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Simulate an API call to fetch product details
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok || !data || data.message) {
          setProduct(null);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      await showModal({
        title: 'Login Required',
        message: 'Please login to add items to your cart.',
        type: 'error',
        placement: 'center',
      });
      return;
    }

    if (product) {
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || product.image || product.productImage || product.thumbnail,
          qty: 1, // Default quantity to 1
        }),
      );
      await showModal({
        title: 'Added to Cart',
        message: `${product.name} has been added to your cart!`,
        type: 'success',
        placement: 'toast',
        autoCloseMs: 5000,
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "100px", color: "#f97316" }}>
        Loading Product Details...
      </div>
    );
  }
  if (!product) {
    return (
      <div style={{ textAlign: "center", margin: "100px", color: "#f97316" }}>
        Product not found.
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-hero">
        <div className="breadcrumb-line">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>{product.category}</span>
        </div>
        <div className="product-detail-grid">
          <div className="product-detail-media">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-detail-image"
            />
          </div>
          <div className="product-detail-copy">
            <span className="product-pill">{product.category}</span>
            <h2>{product.name}</h2>
            <p className="product-price">₹{Number.isFinite(Number(product.price)) ? Number(product.price).toFixed(2) : '0.00'}</p>
            <p className="product-description">{product.description}</p>

            <div className="product-meta-grid">
              <div>
                <strong>Status</strong>
                <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <div>
                <strong>Available</strong>
                <span>{product.stock} units</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn"
              style={{ width: '100%', marginTop: '10px' }}
            >
              {user ? 'Add to Cart' : 'Login to Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
