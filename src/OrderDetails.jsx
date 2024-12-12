import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useParams, Link, useLocation } from 'react-router-dom';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const OrderDetails = () => {
  const { user, loggedIn, logout } = useUser();
  const { orderId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const order_cartid = queryParams.get('order_cartid');

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Order ID:', orderId);
    console.log('Order Cart ID:', order_cartid);
    if (order_cartid) {
      const cart = { // create cart object
        idcart: order_cartid, 
      };
      fetchCartItems(cart);
    }
  }, [orderId, order_cartid]);

  const fetchCartItems = async (cart) => {
    try {
      if (!cart) {
        console.log('No valid cart item ID to fetch items for');
        return;
      }

      const itemsResponse = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( cart ), 
      });
  
      if (!itemsResponse.ok) {
        throw new Error(`Error fetching cart items: ${itemsResponse.status}`);
      }
  
      const allCartItems = await itemsResponse.json();

      console.log("items", allCartItems);

      if (allCartItems.length === 0) {
        setCartItems([]);  // Empty cart
      } else {
        const allCartItemsProductInformation = await Promise.all(
          allCartItems.map(async (item) => {
            const productResponse = await fetch(`http://localhost:5000/api/products/${item.cartitem_productid}`, {
              method: 'GET',
            });

            if (!productResponse.ok) {
              throw new Error(`Error fetching product details for ID ${item.cartitem_productid}: ${productResponse.status}`);
            }

            const productInformation = await productResponse.json();

            return {
              ...item,
              ...productInformation, // Merge product details with cart item details
            };
          })
        );

        setCartItems(allCartItemsProductInformation); // Store the cart items with their details
        console.log("details:", allCartItemsProductInformation);
        const total = allCartItemsProductInformation.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setCartTotal(total); // Store the total value of the cart
      }
    } catch (err) {
      setError('Error fetching cart: ' + err.message);
    }
  };

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
              <li><a href="/login">Login</a></li>
            )}
            {user && user.iduser === 1 && (
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

      {/* Order Details Section */}
      <div className="box">
      <h2 className="products">Order <span style={{ fontSize: '60%', verticalAlign: '20%' }}>#</span>{orderId}</h2>
        {error && <p className="error">{error}</p>} 
        {cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '50px' }}>No products in this order.</p>
        ) : (
          <div className="cart-table">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Image</th>
                  <th style={{ textAlign: 'center' }}>Product Name</th>
                  <th style={{ textAlign: 'center' }}>Quantity</th>
                  <th style={{ textAlign: 'center' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cartitem_id}>
                    <td>
                      <div className="cart-info">
                      <img 
                            src={`/assets/${item.image}`}
                            alt={item.name}
                            className="cart-item-image"
                          />
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'center' }}>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="order-details-back-btn">
          <Link to="/account/orders">
            <button className="submit-btn" style={{ marginTop: '20px', marginBottom: '50px' }}>
              Back to Orders
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className={cartItems.length <= 2 ? 'fixedorderdetails-footer' : 'orderdetails-footer'}>
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

export default OrderDetails;
