import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const ShippingPage = () => {
  const { user, loggedIn, logout } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [order, setOrder] = useState(null);
  const [LastFour, setLastFour] = useState('');
  const [isCartFetched, setIsCartFetched] = useState(false);
  const [isOrderFetched, setIsOrderFetched] = useState(false);
  const [isCardFetched, setIsCardFetched] = useState(false);

  // Fetch the users latest cart info
  const fetchCartInfo = async () => {
    try {
      const cartResponse = await fetch('http://localhost:5000/api/cart/latest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });

      if (!cartResponse.ok) {
        throw new Error(`Error fetching cart info: ${cartResponse.status}`);
      }

      const cartInfo = await cartResponse.json();
      if (!cartInfo.idcart) {
        setError('No cart found for this user');
        return;
      }

      setCart(cartInfo); // Set the fetched cart info

      const itemsResponse = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartInfo),  // Send the cart object to fetch items
      });

      if (!itemsResponse.ok) {
        throw new Error(`Error fetching cart items: ${itemsResponse.status}`);
      }

      const allCartItems = await itemsResponse.json();

      if (allCartItems.length === 0) {
        setError('Your cart is empty.');
      } else {
        const allCartItemsProductInformation = await Promise.all(
          allCartItems.map(async (item) => {
            const productResponse = await fetch(`http://localhost:5000/api/products/${item.cartitem_productid}`);
            if (!productResponse.ok) {
              throw new Error(`Error fetching product details: ${productResponse.status}`);
            }
            const productInformation = await productResponse.json();
            return { ...item, ...productInformation };
          })
        );

        setCartItems(allCartItemsProductInformation);
        const total = allCartItemsProductInformation.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setCartTotal(total);
      }
      setIsCartFetched(true);  // Mark cart fetching as complete
    } catch (err) {
      setError('Error fetching cart: ' + err.message);
    }
  };

  // Fetch order details based on cart ID
  const fetchOrderInfo = async () => {
    try {
      if (!cart || !cart.idcart) {
        console.log("No cart ID available.");
        return;
      }

      const orderResponse = await fetch(`http://localhost:5000/api/user/orders/${cart.idcart}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!orderResponse.ok) {
        throw new Error(`Error fetching order info: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      if (!orderData.idorder) {
        setError('No order found for this cart');
        return;
      }
      setOrder(orderData); // Set the fetched order info
      setIsOrderFetched(true);  // Mark order fetching as complete
    } catch (err) {
      setError('Error fetching order: ' + err.message);
    }
  };

  // Fetch the last four digits of the card number for the given order
  const fetchCardLastFour = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/orders/payment/${order.idorder}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching card number details: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.lastFourDigits) {
        setLastFour(data.lastFourDigits); // Store the last 4 digits of the card number
      } else {
        setError('No payment information found for this order');
      }
      setIsCardFetched(true);  // Mark card fetching as complete

    } catch (err) {
      setError(`Error retrieving card details: ${err.message}`);
    }
  };

  const handleOrderSuccess = () => {
    window.location.href = '/products';  // Redirect to the products page to continue shopping
  };

  // fetchthe data in order user info - cart info - order info - card info - then create new cart once all info is collected
  useEffect(() => {
    if (loggedIn && !isCartFetched) {
      fetchCartInfo();
    }
  }, [loggedIn, isCartFetched]);

  useEffect(() => {
    if (isCartFetched && !isOrderFetched) {
      fetchOrderInfo();
    }
  }, [isCartFetched, isOrderFetched]);

  useEffect(() => {
    if (isOrderFetched && !isCardFetched) {
      fetchCardLastFour();
    } 
  }, [isOrderFetched, isCardFetched]);

  useEffect(() => {
    if (isCartFetched && isOrderFetched && isCardFetched) {
      createNewCart();  // Create a new cart only when all the flags are true
    }
  }, [isCartFetched, isOrderFetched, isCardFetched]);


  const createNewCart = async () => {
    try {
      const cartResponse = await fetch('http://localhost:5000/api/cart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });

      if (!cartResponse.ok) {
        throw new Error('Error creating new cart');
      }

      const newCart = await cartResponse.json();
      console.log('New cart created:', newCart);
    } catch (err) {
      setError('Error creating new cart: ' + err.message);
    }
  };

  const generateTrackingNumber = () => { // custom tracking number
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';  // all letters and digits
    let trackingNumber = 'PP';  // Prefix PP for PixelParts
    for (let i = 0; i < 9; i++) { 
      const index = Math.floor(Math.random() * characters.length);  // Generate random index for the character index
      trackingNumber += characters[index];  // add the random character to the tracking number 
    }
    return trackingNumber;
  };

  return (
    <div className="checkout-page">
      {/* Header */}
      <header id="header">
      <a href="/"><img src={logoImg} className="logo" alt="PixelParts Logo" /></a>
        <div>
          <ul id="navbar">
            <li><a href="/">Home</a></li>
            <li className="dropdown">
              <a href="/products">Products</a>
              <ul className="dropdown-content">
                <li><a href="#" onClick={() => handleFilterChange('Processors')}>Processors</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Motherboards')}>Motherboards</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Graphics Cards')}>Graphics Cards</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Memory')}>Memory</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Storage')}>Storage</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Power Supplies')}>Power Supplies</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Cooling and Lighting')}>Cooling and Lighting</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Cases')}>Cases</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Peripherals and Accessories')}>Peripherals and Accessories</a></li>
              </ul>
            </li>
            <li><a href="/aboutus">About Us</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact Us</a></li>
            {loggedIn ? (
              <li className="dropdown">
                <a href="/account/settings">
                  Hello, {user && user.firstname ? user.firstname : "User"}
                </a>
                <ul className="dropdown-content">
                  <li><a href="/account/settings">Account Settings</a></li>
                  <li><a href="/account/orders">Orders</a></li>
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

      <div className="cart-container">
        <div className="box">
          <h1>Order Confirmation</h1>

          <div className="order-confirmation-details">
            <h2>Thank You for Your Purchase!</h2>
            <p>Your order has been successfully processed. We appreciate your business.</p>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.idproduct}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-details">
              <h4>Order Information</h4>
              <p><strong>Order Number:</strong> #{cart?.idcart}</p>
              <p><strong>Order Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Estimated Delivery:</strong> {new Date(new Date().setDate(new Date().getDate() + 6)).toLocaleDateString()}</p>
            </div>

            <div className="shipping-details">
              <h3>Shipping Information</h3>
              <p><strong>Shipping Method:</strong> Standard Shipping (5-7 Business Days)</p>
              <p><strong>Tracking Number:</strong> {generateTrackingNumber()}</p>
              <p><strong>Shipping Address:</strong><br />
                {order?.firstname} {order?.lastname}<br />
                {order?.shippingaddress}<br />
                {order?.shippingcity}, {order?.shippingstate} {order?.shippingzip}
              </p>
            </div>

            <div className="payment-details">
              <h3>Payment Details</h3>
              <p><strong>Payment Information:</strong> CARD ●●●● {LastFour}</p>
              <p><strong>Subtotal:</strong> ${cartTotal}</p>
              <p><strong>Tax:</strong> ${(cartTotal * 0.05).toFixed(2)}</p>
              <p><strong>Total:</strong> ${(cartTotal * 1.05).toFixed(2)}</p>
            </div>

            <div className="cart-containter cart-page cart-info">
              <a href="/account/orders" className="shipping-button">View Orders</a>
              <a href="/products" className="shipping-button" onClick={handleOrderSuccess}>Continue Shopping</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p><a href="/aboutus">About Us</a> | <a href="/PrivacyPolicy">Privacy Policy</a> | <a href="/TermsOfService">Terms of Service</a></p>
        <div className="social-media">
          <a href="#"><img src={facebookIcon} className="social-media-icon" alt="Facebook" /></a>
          <a href="#"><img src={instagramIcon} className="social-media-icon" alt="Instagram" /></a>
          <a href="#"><img src={twitterIcon} className="social-media-icon" alt="Twitter" /></a>
        </div>
      </footer>
    </div>
  );
};

export default ShippingPage;
