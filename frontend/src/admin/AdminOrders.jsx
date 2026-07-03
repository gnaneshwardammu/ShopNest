import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((currentOrders) =>
          currentOrders.map((order) => (order._id === orderId ? { ...order, status } : order)),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div style={pageStateStyle}>Loading orders...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={{ color: '#f97316', marginBottom: '8px' }}>Manage Orders</h2>
          <p style={{ color: '#a1a1aa' }}>Track order progress and update delivery statuses.</p>
        </div>
        <button className="btn" onClick={() => navigate('/admin')} style={{ background: '#3f3f46' }}>
          Back to Dashboard
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ORDER</th>
              <th style={thStyle}>CUSTOMER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>PAYMENT</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} style={rowStyle}>
                  <td style={tdStyle}>{order._id.substring(0, 8)}...</td>
                  <td style={tdStyle}>{order.user?.name || order.user?.username || order.address?.fullName || 'Guest'}</td>
                  <td style={tdStyle}>₹{Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td style={tdStyle}>{order.paymentId ? order.paymentId.substring(0, 10) + '...' : 'N/A'}</td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(order.status)}>{order.status}</span>
                  </td>
                  <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      style={selectStyle}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processed">Processed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={emptyStyle} colSpan="7">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.1)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem', whiteSpace: 'nowrap' };
const tdStyle = { padding: '15px', textAlign: 'left', whiteSpace: 'nowrap' };
const emptyStyle = { padding: '30px', textAlign: 'center', color: '#a1a1aa' };
const pageStateStyle = { textAlign: 'center', margin: '80px 0', color: '#f97316' };
const selectStyle = { background: '#09090b', color: '#fff', border: '1px solid #27272a', borderRadius: '8px', padding: '8px 10px', outline: 'none' };
const statusBadgeStyle = (status) => ({
  display: 'inline-flex',
  padding: '6px 10px',
  borderRadius: '999px',
  fontSize: '0.85rem',
  fontWeight: 700,
  background:
    status === 'Delivered'
      ? 'rgba(16,185,129,0.14)'
      : status === 'Shipped'
        ? 'rgba(59,130,246,0.14)'
        : status === 'Cancelled'
          ? 'rgba(239,68,68,0.14)'
          : 'rgba(245,158,11,0.14)',
  color:
    status === 'Delivered'
      ? '#10b981'
      : status === 'Shipped'
        ? '#3b82f6'
        : status === 'Cancelled'
          ? '#ef4444'
          : '#f59e0b',
});

export default AdminOrders;
