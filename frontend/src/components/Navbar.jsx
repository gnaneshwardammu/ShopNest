import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {useNavigate} from 'react-router-dom';
import { useSelector } from "react-redux";

const Navbar = () => {
  const {user, logout} = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const cartCount = cartItems.length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
        <div className="navbar">
            <Link to="/">
            <img src="dark-removebg-preview.png" alt="ShopNest Logo" style={{ width: '60px', height: '60px' }} /></Link>
        </div>

        <ul className="navbar-links">
            <li><Link to="/shop">Shop</Link></li>
            {user ? (
              <>
              <li><Link to="/cart">Cart({cartCount})</Link></li>
              <li><Link to="/profile">Hi {user.name}</Link></li>
              {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
              <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
              </>
            ):(
              <li><Link to="/login">Login</Link></li>
            )}
        </ul>   
    </nav>
  );
};

export default Navbar;