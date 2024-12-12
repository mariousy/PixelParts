import React from 'react';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import './styles.css';
import { useUser } from './UserContext';

const BlogsPage = () => {
  const { user, loggedIn, logout } = useUser();

  return (
    <div className="blogs-page">
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
            <li><a href="/blog" className="active">Blog</a></li>
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
      </section>

      {/* Blog Section */}
      <div className="text-sections">
        <section className="box">
          <article>
            <h1>10 Must-have PC parts for a High-Performance Build</h1>
            <p>Date: 10-05-2024</p>
            <p>So, you are ready to build a High-Performance PC. Whether it's for gaming, video editing, or just wanting your computer to handle anything you throw at it, this guide will break down the essential parts you need. Let's make it!</p>
            
            <h2>1. Processor (CPU)</h2>
            <p>Your CPU is like the brain of your computer—it runs the show! For a high-performance build, aim for something like an <strong>Intel Core i9</strong> or an <strong>AMD Ryzen 9</strong>. These CPUs are great for gaming, rendering, and multitasking like a pro.</p>
            <p><strong>Pro Tip:</strong> Make sure your CPU fits your motherboard's socket type.</p>

            <h2>2. Graphics Processing Unit (GPU)</h2>
            <p>This is one of the most crucial parts for rendering high-quality visuals. Leading GPUs for PCs are <strong>NVIDIA GeForce RTX 4090</strong> and <strong>AMD Radeon RX 7900 XTX</strong>.</p>
            <p><strong>Pro Tip:</strong> When picking a GPU for gaming, consider resolution and frame rate. For higher resolutions like 1440p or 4K, go for an RTX 4080 or RX 7900 XT.</p>

            {/* Additional blog sections */}
            <h2>3. Motherboard</h2>
            <p>This connects all components, ensuring they work together seamlessly.</p>
            <p><strong>Pro Tip:</strong> Consider <strong>Compatibility</strong>, <strong>RAM Capacity</strong>, and <strong>Ports and Connectivity</strong> when choosing a motherboard.</p>

            <h2>4. Random Access Memory (RAM)</h2>
            <p>Enables multitasking and smooth gameplay. More RAM means faster load times.</p>
            <p><strong>Pro Tip:</strong> For future-proofing, consider <strong>G.Skill Trident Z Neo 32GB (2x16GB)</strong>.</p>

            <h2>5. Solid-State Drives</h2>
            <p>Provides faster storage, quick boot times, and faster load times compared to traditional hard drives.</p>
            <p><strong>Pro Tip:</strong> Recommended SSDs: <strong>Samsung 980 Pro (1TB) & Kingston A2000 (500GB)</strong>.</p>

            <h2>6. Power Supply (PSU)</h2>
            <p>Powers the entire system, ensuring stability and reliability.</p>
            <p><strong>Pro Tip:</strong> Mid-range systems require 400W-650W PSU.</p>

            <h2>7. Cooling System</h2>
            <p>Prevents overheating, extending the life of components.</p>
            <p><strong>Pro Tip:</strong> Choose between <strong>Air Cooling</strong> for budget builds and <strong>Liquid Cooling</strong> for high-performance needs.</p>

            <h2>8. Case</h2>
            <p>Ensures optimal airflow and enhances the aesthetic appeal.</p>
            <p><strong>Pro Tip:</strong> Look for good <strong>Airflow, Size and Compatibility,</strong> and <strong>Cable Management</strong> options.</p>

            <h2>9. Peripherals</h2>
            <p>Enhances your experience with performance, comfort, and immersion.</p>
            <p><strong>Pro Tip:</strong> Choose high-performance peripherals for better accuracy and responsiveness.</p>

            <h2>10. Operating System (OS)</h2>
            <p>Provides the software environment for all hardware.</p>
            <p><strong>Pro Tip:</strong> Windows 11 is ideal for high-performance systems, featuring <strong>DirectStorage</strong> for faster loading and <strong>Auto HDR</strong> for enhanced visuals.</p>
          </article>
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

export default BlogsPage;
