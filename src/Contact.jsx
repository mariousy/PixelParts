import React from 'react';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import './styles.css'; 
import { useUser } from './UserContext';

const ContactPage = () => {
  const { user, loggedIn, logout } = useUser();

  return (
    <div className="contact-us">
      {/* Header */}
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
            <li><a href="/contact" className="active">Contact Us</a></li>
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
      </section>

      {/* Contact Section */}
      <div className="text-sections">
        <section className="box">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Whether you have a question about our products, services, or need assistance with an order, our team is here to help.</p>

          <div>
            <h2>Customer Support</h2>
            <p><strong>Email:</strong> team.pixelparts@gmail.com (Respond within 24 hours)</p>
            <p><strong>Mailing Address:</strong><br />Pixel Parts<br />115 Library Dr<br />Rochester, MI 48309</p>
          </div>

          <div className="contact-form">
            <h2>Contact Form</h2>
            <form action="https://formspree.io/f/xdkonzga" method="POST">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />

              <label htmlFor="subject">Subject:</label>
              <input type="text" id="subject" name="subject" required />

              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" rows="5" required></textarea>

              <button type="submit">Submit</button>
            </form>
          </div>
        </section>
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

export default ContactPage;
