import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const Orders = () => {
  const { user, loggedIn, logout } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders tied to the user account ID  
  const fetchOrders = async () => {
    try {
      if (!user || !user.iduser) { // check for user logged in and user has a valid stored ID
        throw new Error('User not logged in');
      }
      const response = await fetch(`http://localhost:5000/api/user/orders/all/${user.iduser}`);

      const textResponse = await response.text();

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
  
      const data = JSON.parse(textResponse);
      setOrders(data); // Set the fetched orders
      setLoading(false); // Set the loading state - only loading the orders once
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message); // Set the error message
      setLoading(false); // Set the loading state - only loading the orders once
    }
  };

  useEffect(() => {
    if (user && user.iduser) {
      fetchOrders();
    }
  }, [user]); 

  return (
    <div className="account-page">
      {/* Header Section */}
      <section id="header">
        <a href="/"><img src={logoImg} className="logo" alt="PixelParts Logo" /></a>
        <div>
          <ul id="navbar">
            <li><a href="/">Home</a></li>
            <li className="dropdown">
              <a href="/products">Products</a>
              <ul className="dropdown-content">
                <li><a href="/products?filter=Processors">Processors</a></li>
                <li><a href="/products?filter=Motherboards">Motherboards</a></li>
                <li><a href="/products?filter=Graphics Cards">Graphics Cards</a></li>
                <li><a href="/products?filter=Memory">Memory</a></li>
                <li><a href="/products?filter=Storage">Storage</a></li>
                <li><a href="/products?filter=Power Supplies">Power Supplies</a></li>
                <li><a href="/products?filter=Cooling and Lighting">Cooling and Lighting</a></li>
                <li><a href="/products?filter=Cases">Cases</a></li>
                <li><a href="/products?filter=Peripherals and Accessories">Peripherals and Accessories</a></li>
              </ul>
            </li>
            <li><a href="/aboutus">About Us</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact Us</a></li>
            {loggedIn ? (
              <li className="dropdown">
                <a href="/account/settings" className="active">Hello, {user && user.firstname ? user.firstname : "User"}</a>
                <ul className="dropdown-content">
                  <li><a href="/account/settings">Account Settings</a></li>
                  <li><a href="/account/orders">Orders</a></li>
                  <li><button onClick={logout} className="logout-button">Logout</button></li>
                </ul>
              </li>
            ) : (
              <li><a href="/login" >Login</a></li>
            )}
            {user && user.iduser === 1 && ( // show admin panel only to iduser 1 which is the admin account
              <li><a href="/admin">Admin Panel</a></li>
            )}
          </ul>
        </div>
        <div className="container">
          {loggedIn && (
            <a href="/user/cart" className="cart-icon">
              <img src={cartIcon} alt="Cart" className="cart-icon-img" />
            </a>
          )}
        </div>
      </section>

      {/* Order History Section */}
      <div className="box">
        <h2 className="products">Order History</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Click for more info</th>
              <th>Total Cost</th>
              <th>Items</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5">{error}</td>
              </tr>
            ) : (
              orders.length === 0 ? (
                <tr>
                  <td colSpan="5" align="center" style={{ fontSize: '38px'}}>No orders found</td>
                </tr>
              ) : (
                orders.map(order => {
                  // Format the order date to month/day/year
                  const formattedDate = new Date(order.orderdate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }); 

                  return (
                    <tr key={order.idorder}>
                      <td>{order.idorder}</td>
                      <td className="cart-info">
                        <a href={`/account/orders/details/${order.idorder}?order_cartid=${order.order_cartid}`} className="order-details-link">Order Details</a>
                      </td>
                      <td>${order.total}</td>
                      <td>{order.totalItems}</td>
                      <td>{formattedDate}</td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className={orders.length === 0 ? 'fixedorders-footer' : 'orders-footer'}>
        <p><a href="/aboutus">About Us</a> | <a href="/PrivacyPolicy">Privacy Policy</a> | <a href="/TermsOfService">Terms of Service</a></p>
        <div className="home-social-media">
          <a href="#"><img src={facebookIcon} alt="Facebook" className="social-media-icon" /></a>
          <a href="#"><img src={instagramIcon} alt="Instagram" className="social-media-icon" /></a>
          <a href="#"><img src={twitterIcon} alt="Twitter" className="social-media-icon" /></a>
        </div>
      </footer>
    </div>
  );
};

export default Orders;
