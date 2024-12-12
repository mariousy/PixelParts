import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext'; 
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';  

const CheckoutPage = () => {
  const { user, loggedIn, logout } = useUser(); 
  const [cartItems, setCartItems] = useState([]);  
  const [cart, setCart] = useState(null);  
  const [cartTotal, setCartTotal] = useState(0);
  const [userDetails, setUserDetails] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      cellphone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    },
    payment: {
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    }
  });
  const [error, setError] = useState('');

  // Fetch the user's latest cart info
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
    } catch (err) {
      setError('Error fetching cart: ' + err.message);
    }
  };

  // Handle form submission for checkout
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the function to complete the order
    completeOrder();
  };

  // Function to complete the order by calling both the payment and order APIs
  const completeOrder = async () => {
    setError('');
  
    try {
      const totalWithTax = cartTotal * 1.05; // 5% tax added
      // Create the order first
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_cartid: cart.idcart,  
          firstname: userDetails.personal.firstName,
          lastname: userDetails.personal.lastName,
          email: userDetails.personal.email,
          cellphone: userDetails.personal.cellphone,
          shippingaddress: userDetails.personal.address,
          shippingcity: userDetails.personal.city,
          shippingstate: userDetails.personal.state,
          shippingzip: userDetails.personal.zip,
        }),
      });
  
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
  
      const orderData = await orderResponse.json();
      console.log('Order successful:', orderData);
  
      // After the order is created successfully, process the payment
      const paymentResponse = await fetch('http://localhost:5000/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_orderid: orderData.idorder, 
          fullname: userDetails.payment.cardholderName,
          cardnumber: userDetails.payment.cardNumber,
          expirationdate: userDetails.payment.expiry,
          securitycode: userDetails.payment.cvv,
          total: totalWithTax,
        }),
      });
  
      if (!paymentResponse.ok) {
        throw new Error('Failed to process payment');
      }
  
      const paymentData = await paymentResponse.json();
      console.log('Payment successful:', paymentData);
  
      window.location.href = '/user/cart/checkout/shipping';
  
    } catch (err) {
      setError('Error completing the order: ' + err.message);
      console.error('Order completion error:', err);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setUserDetails(prevDetails => {
      const newDetails = {
        ...prevDetails,
        [section]: {
          ...prevDetails[section],
          [field]: value,
        },
      };
      return newDetails;
    });
  };

  useEffect(() => {
    if (!loggedIn || !user) return; // skips if you aren't logged in
    fetchCartInfo(); // Fetch the latest cart info for the user
  }, [loggedIn, user]); // Runs when logged in or when user changes

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

      {/* Checkout Section */}
      <h1>Checkout</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="checkout-wrapper">
        <div className="payment-info">
          <h2>Required Information</h2>
          <p>Complete your transaction swiftly and securely with our easy-to-use payment process.</p>
          <form onSubmit={handleSubmit}>
            <h3>Personal Details</h3>
            <div className="expiry-cvv">
              <input
                type="text"
                name="personal.firstName"
                placeholder="First Name"
                required
                value={userDetails.personal.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="personal.lastName"
                placeholder="Last Name"
                required
                value={userDetails.personal.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="expiry-cvv">
              <input
                type="email"
                name="personal.email"
                placeholder="Email"
                required
                value={userDetails.personal.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="personal.cellphone"
                placeholder="Phone No."
                required
                value={userDetails.personal.cellphone}
                onChange={handleInputChange}
              />
            </div>

            <h3>Shipping Address</h3>
            <div className="expiry-cvv">
              <input
                type="text"
                name="personal.address"
                placeholder="Address Line"
                required
                value={userDetails.personal.address}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="personal.city"
                placeholder="City"
                required
                value={userDetails.personal.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="expiry-cvv">
              <input
                type="text"
                name="personal.state"
                placeholder="State"
                required
                value={userDetails.personal.state}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="personal.zip"
                placeholder="Zip Code"
                required
                value={userDetails.personal.zip}
                onChange={handleInputChange}
              />
            </div>

            <h3>Payment Information</h3>
            <input
              type="text"
              name="payment.cardholderName"
              placeholder="Cardholder's Name"
              required
              value={userDetails.payment.cardholderName}
              onChange={handleInputChange}
            />
            <div className="card-details">
              <input
                type="text"
                name="payment.cardNumber"
                placeholder="Card Number"
                required
                value={userDetails.payment.cardNumber}
                onChange={handleInputChange}
              />
              <div className="card-icons">
                <img src="/assets/mastercard.png" alt="Mastercard" />
                <img src="/assets/visa.png" alt="Visa" />
              </div>
            </div>
            <div className="expiry-cvv">
              <input
                type="text"
                name="payment.expiry"
                placeholder="EXP."
                required
                value={userDetails.payment.expiry}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="payment.cvv"
                placeholder="CVV"
                required
                value={userDetails.payment.cvv}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="pay-button">Complete Order</button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.idcartitem} className="cart-item">
                <p>{item.name} x{item.quantity} - ${item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="total-details">
            <p>Subtotal: ${cartTotal.toFixed(2)}</p>
            <p>Tax: ${(cartTotal * 0.05).toFixed(2)}</p>
            <h3>Total: ${(cartTotal * 1.05).toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
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

export default CheckoutPage;
