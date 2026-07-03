import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const VerifyOtp = () => {
  const [email, setEmail] = useState(localStorage.getItem('pendingOtpEmail') || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem('pendingOtpEmail');
        setMessage(data.message || 'OTP verified successfully. You can now log in.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setMessage(data.message || 'OTP verification failed');
      }
    } catch (error) {
      setMessage('Unable to verify OTP. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage('Please enter your email first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || 'OTP resent successfully.');
    } catch (error) {
      setMessage('Unable to resend OTP. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleVerify} className="auth-form">
        <h2>Verify OTP</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button type="button" className="btn" onClick={handleResend} disabled={loading} style={{ marginTop: '10px', background: '#3f3f46' }}>
          Resend OTP
        </button>
        {message ? <p style={{ marginTop: '12px', color: '#f97316' }}>{message}</p> : null}
        <p style={{ marginTop: '12px' }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
