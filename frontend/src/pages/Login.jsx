import React, {useState, useContext} from "react";
import {useNavigate, Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/auth.css';
import { apiFetch } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const { showModal } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            const data = await res.json();
            if (res.ok) {
                await showModal({
                    title: 'Login Successful',
                    message: 'You are now signed in.',
                    type: 'success',
                    placement: 'toast',
                    autoCloseMs: 1000,
                });
                login(data);
                navigate('/');
            } else if (res.status === 403) {
                localStorage.setItem('pendingOtpEmail', email);
                await showModal({
                    title: 'Verification Required',
                    message: data.message || 'Please verify your OTP before logging in.',
                    type: 'error',
                    placement: 'center',
                });
                navigate('/verify-otp');
            } else {
                await showModal({
                    title: 'Login Failed',
                    message: data.message ? `Login failed: ${data.message}` : 'Login failed.',
                    type: 'error',
                    placement: 'center',
                });
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </form>
        </div>
    );
};

export default Login;
