import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { useNotification } from '../context/NotificationContext';
import { apiFetch } from '../services/api';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showModal } = useNotification();

  const [address, setAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const buildOrderPayload = (paymentId) => ({
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.qty,
      price: item.price,
    })),
    totalAmount: totalPrice,
    address,
    paymentId,
  });

  const saveOrderToDb = async (paymentId) => {
    return apiFetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(buildOrderPayload(paymentId)),
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handlePayment = async () => {
    try {
      const orderRes = await apiFetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        const fallbackChoice = await showModal({
          title: 'Razorpay Not Ready',
          message: 'Razorpay keys are not configured on the backend. Do you want to continue with bypass test order mode?',
          type: 'info',
          placement: 'center',
          actions: [
            { label: 'Cancel', value: 'cancel' },
            { label: 'Use Bypass Mode', value: 'bypass' },
          ],
        });

        if (fallbackChoice?.action === 'bypass') {
          return bypassPayment();
        }

        return;
      }

      const options = {
        key: 'rzp_test_T57EcZd0QQDc0H', // Student dummy fallback
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await apiFetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          if (verifyRes.ok) {
            const saveOrderRes = await saveOrderToDb(response.razorpay_payment_id);

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              const errorData = await saveOrderRes.json().catch(() => ({}));
              await showModal({
                title: 'Order Save Failed',
                message: errorData.message || 'Payment was successful, but the order could not be saved to the database.',
                type: 'error',
                placement: 'center',
              });
            }
          } else {
            await showModal({
              title: 'Verification Failed',
              message: 'Payment verification failed.',
              type: 'error',
            });
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: user?.phone || address.phone || '9999999999'
        },
        theme: {
          color: '#f97316'
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await saveOrderToDb('bypass_txn_' + Date.now());
    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    } else {
      const errorData = await saveOrderRes.json().catch(() => ({}));
      await showModal({
        title: 'Order Save Failed',
        message: errorData.message || 'Unable to save the order in bypass mode.',
        type: 'error',
        placement: 'center',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      await showModal({
        title: 'Login Required',
        message: 'Please login first.',
        type: 'error',
        placement: 'center',
      });
      navigate('/login');
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="tel" placeholder="Phone Number" required value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="State" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
