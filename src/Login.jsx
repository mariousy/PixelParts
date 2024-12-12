import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUser } from './UserContext'; 
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import logoImg from './assets/pixelparts.png';
import './styles.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [cellphone, setCellphone] = useState('');

  const { login } = useUser(); 
  const navigate = useNavigate(); 

  const defaultUser = {
    email: '',
    password: '',
    firstname: null,
    lastname: null,
    streetaddress: null,
    city: null,
    state: null,
    zip: null,
    cellphone: null,
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        login(data); // Store user data in context
        navigate('/products'); // Redirect to the products page
      } else {
        alert('Invalid email or password'); // Show alert if authentication fails
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    const newUser = {
      ...defaultUser,
      email,
      password,
      firstname,
      lastname,
      streetaddress: streetAddress,
      city,
      state,
      zip,
      cellphone
    };

    try {
      const response = await fetch('http://localhost:5000/api/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Account created successfully!');
        login(data); 
        const user = data;
        const newCartResponse = await fetch('http://localhost:5000/api/cart/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user }), // Sending the user object
        });
        if (!newCartResponse.ok) {
          throw new Error(`Error creating new cart: ${newCartResponse.status}`);
        }
        const cart = await newCartResponse.json();
        navigate('/products/user'); 
      } else {
        alert('Error creating account');
      }
    } catch (err) {
      console.error('Account creation failed:', err);
    }
  };

  return (
    <main className="login-body">
      <header id="header">
        <a href="/"><img src={logoImg} className="logo" alt="PixelParts Logo" /></a>
        <nav>
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
            <li><a href="/login">Login</a></li>
          </ul>
        </nav>
        <div className="invisible-space"></div> {/* Invisible space on the right */}
      </header>

      <div className="login-container">
        <div className="tab-buttons">
          <button className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>Login</button>
          <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>Create Account</button>
        </div>

        {activeTab === 'login' ? (
          <div className="login-form">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email Address:</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
          </div>
        ) : (
          <div className="create-account-form">
            <h1>Create Account</h1>
            <form onSubmit={handleCreateAccount}>
              <label htmlFor="email">Email Address:</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label htmlFor="firstname">First Name:</label>
              <input type="text" id="firstname" name="firstname" placeholder="Enter your First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              <label htmlFor="lastname">Last Name:</label>
              <input type="text" id="lastname" name="lastname" placeholder="Enter your Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
              <label htmlFor="streetAddress">Street Address:</label>
              <input type="text" id="streetAddress" name="streetAddress" placeholder="Enter your street address" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required />
              <label htmlFor="city">City:</label>
              <input type="text" id="city" name="city" placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)} required />
              <label htmlFor="state">State:</label>
              <input type="text" id="state" name="state" placeholder="Enter your state" value={state} onChange={(e) => setState(e.target.value)} required />
              <label htmlFor="zip">Zip:</label>
              <input type="text" id="zip" name="zip" placeholder="Enter your zip code" value={zip} onChange={(e) => setZip(e.target.value)} required />
              <label htmlFor="cellphone">Cellphone:</label>
              <input type="text" id="cellphone" name="cellphone" placeholder="Enter your cellphone" value={cellphone} onChange={(e) => setCellphone(e.target.value)} required />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        )}
      </div>

      <footer className="login-footer">
        <p><a href="/aboutus">About Us</a> | <a href="/PrivacyPolicy">Privacy Policy</a> | <a href="/TermsOfService">Terms of Service</a></p>
        <div className="social-media">
          <a href="#"><img src={facebookIcon} className="social-media-icon" alt="Facebook" /></a>
          <a href="#"><img src={instagramIcon} className="social-media-icon" alt="Instagram" /></a>
          <a href="#"><img src={twitterIcon} className="social-media-icon" alt="Twitter" /></a>
        </div>
      </footer>
    </main>
  );
};

export default LoginPage;
