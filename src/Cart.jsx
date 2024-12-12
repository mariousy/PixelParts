import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const CartPage = () => {
  const { user, loggedIn, logout } = useUser();
  const [cartItems, setCartItems] = useState([]); 
  const [cart, setCart] = useState(null); 
  const [error, setError] = useState('');
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch cart items from the backend
  const fetchCartItems = async () => {
    try {
      if (!cart || !cart.idcart) {
        console.log('No valid cart to fetch items for');
        return;
      }
  
      const itemsResponse = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart), // Send the cart object
      });
  
      if (!itemsResponse.ok) {
        throw new Error(`Error fetching cart items: ${itemsResponse.status}`);
      }
  
      const allCartItems = await itemsResponse.json();
  
      // Handle empty cart response
      if (allCartItems.length === 0) {
        setCartItems([]);  // Empty cart, no items
      } else {
        const allCartItemsProductInformation = await Promise.all(
          allCartItems.map(async (item) => {
            const productResponse = await fetch(`http://localhost:5000/api/products/${item.cartitem_productid}`, {
              method: 'GET', // GET request to fetch product details by ID
            });
  
            if (!productResponse.ok) {
              throw new Error(`Error fetching product details for ID ${item.cartitem_productid}: ${productResponse.status}`);
            }
  
            const productInformation = await productResponse.json();
            return {
              ...item,
              ...productInformation, // Merge the product details with the cart item
            };
          })
        );
  
        setCartItems(allCartItemsProductInformation); // Store cart items with product details
        const total = allCartItemsProductInformation.reduce((acc, item) => acc + item.price * item.quantity, 0); // Calculate total
        setCartTotal(total); // Store total
      }
    } catch (err) {
      setError('Error fetching cart: ' + err.message);
    }
  };
  
  

  const fetchcartInfo = async () => {
    try {
      const cartResponse = await fetch('http://localhost:5000/api/cart/latest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }), // Sending the user object
      });

      if (!cartResponse.ok) {
        throw new Error(`Error fetching latest cart: ${cartResponse.status}`);
      }

      const cartInfo = await cartResponse.json();
      if (!cartInfo.idcart) {
        setError('No cart found for this user');
        return;
      }

      setCart(cartInfo); // Store current cart
    } catch (err) {
      setError('Error fetching cart: ' + err.message);
    }
  };

  useEffect(() => {
    if (!loggedIn || !user) return; // skips if you aren't logged in
    fetchcartInfo(); // Fetch the latest cart info for the user
  }, [loggedIn, user]); // Runs when logged in or when user changes

  useEffect(() => {
    if (cart && cart.idcart) { // makes sure that a valid cart is set
      fetchCartItems();  // Fetch all the items from the cart
    }
  }, [cart]);  // Runs when the cart is updated

  const handleQuantityChange = async (idcartitem, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity to go below 1

    try {
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idcartitem,
          newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating quantity: ${response.statusText}`);
      }

      setCartItems((prevItems) => {
        return prevItems.map((item) =>
          item.idcartitem === idcartitem ? { ...item, quantity: newQuantity } : item
        );
      });

      const newTotal = cartItems.reduce((acc, item) => {
        return acc + (item.idcartitem === idcartitem ? newQuantity * item.price : item.quantity * item.price);
      }, 0);
      setCartTotal(newTotal);
    } catch (error) {
      setError('Error updating quantity: ' + error.message);
      console.error(error);
    }
  };

  const handleRemoveItem = async (idcartitem) => {
    try {
      setCartItems((prevItems) => prevItems.filter((item) => item.idcartitem !== idcartitem));

      const newTotal = cartItems.reduce((acc, item) => item.idcartitem !== idcartitem ? acc + item.price * item.quantity : acc, 0);
      setCartTotal(newTotal);

      const response = await fetch(`http://localhost:5000/api/cart/remove/${idcartitem}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.statusText}`);
      }

      console.log('Item removed from database');
    } catch (error) {
      setError('Error removing item: ' + error.message);
      console.error(error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      // If the cart is empty, redirect to /products
      window.location.href = '/products';
    } else {
      // Otherwise, allow the user to proceed to checkout
      window.location.href = '/user/cart/checkout';
    }
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <header id="header">
        <a href="/"><img src={logoImg} className="logo" alt="PixelParts Logo" /></a>
        <div>
          <ul id="navbar">
            <li><a href="/">Home</a></li>
            <li className="dropdown">
              <a href="/products" className="active">Products</a>
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
                <a href="/account/settings">Hello, {user && user.firstname ? user.firstname : "User"}</a>
                <ul className="dropdown-content">
                  <li><a href="/account/settings">Account Settings</a></li>
                  <li><a href="/orders">Orders</a></li>
                  <li><button onClick={logout} className="logout-button">Logout</button></li>
                </ul>
              </li>
            ) : (
              <li><a href="/login">Login</a></li>
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
      </header>

      {/* Cart Section */}
      <h1>Shopping Cart</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="cart-container">

          {cartItems.length === 0 ? (
            <p style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginTop: '125px', marginBottom: '125px' }}>Your cart is empty</p>
          ) : (
            <div className="cart-table">
              {/* Cart Table Header */}
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Iterate through cart items */}
                  {cartItems.map((item) => (
                    <tr key={item.idcartitem}>
                      {/* Product Image and Info */}
                      <td>
                        <div className="cart-info">
                          <img
                            src={`/assets/${item.image}`}
                            alt={item.name}
                            className="cart-item-image"
                          />
                          <div>
                            <h3>{item.name}</h3>
                            <small>Price: ${item.price}</small>
                            <br />
                            <button className="remove-btn" onClick={() => handleRemoveItem(item.idcartitem)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Quantity Input */}
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          className="quantity"
                          min="1"
                          onChange={(e) => handleQuantityChange(item.idcartitem, parseInt(e.target.value))}
                        />
                      </td>

                      {/* Subtotal for this item */}
                      <td className="subtotal-price">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cart Total */}
          <div className="cart-total">
            <table>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>${cartTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Tax (5%)</td>
                  <td>${(cartTotal * 0.05).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>${(cartTotal * 1.05).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Checkout Button */}
            <button className="checkout-button" onClick={handleCheckout}>
                {cartItems.length === 0 ? 'Browse Products' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={cartItems.length === 1 ? 'fixedcart-footer' : 'cart-footer'}>
        <p><a href="/aboutus">About Us</a> | <a href="/PrivacyPolicy">Privacy Policy</a> | <a href="/TermsOfService">Terms of Service</a></p>
        <div className="social-media">
          <a href="#"><img src={facebookIcon} alt="Facebook" className="social-media-icon" /></a>
          <a href="#"><img src={instagramIcon} alt="Instagram" className="social-media-icon" /></a>
          <a href="#"><img src={twitterIcon} alt="Twitter" className="social-media-icon" /></a>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;