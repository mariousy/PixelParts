import React from 'react';
import './styles.css'; 
import logoImg from './assets/pixelparts.png';
import team1Img from './assets/Team1.jpg';
import team2Img from './assets/Team2.jpg';
import team3Img from './assets/Team3.jpg';
import team4Img from './assets/Team4.jpg';
import team5Img from './assets/Team5.jpg';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import cartIcon from './assets/cart.png';
import twitterIcon from './assets/twitter.png';
import { useUser } from './UserContext';

const AboutUs = () => {
  const { user, loggedIn, logout } = useUser();

  return (
    <div className="about-us-page">
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
            <li><a href="/aboutus" className="active">About Us</a></li>
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
      </section>

      {/* Main Content */}
      <div className="text-sections">
        <section className="box">
          <h2>Who We Are</h2>
          <p>
            At PixelParts, we’re more than just a store—we’re your tech-savvy friends who are just as excited about
            building and upgrading as you are! Whether you're dreaming of piecing together your ultimate custom rig or
            just want to give your current setup a little boost, we’re right here with you, ready to share our tips and
            expertise.
          </p>
        </section>

        <section className="box">
          <h2>Our Story</h2>
          <p>
            PixelParts was founded with a simple goal: to provide top-quality components with unparalleled customer
            service. After our team noticed a gap in the market for a trusted, customer-first retailer, PixelParts was
            born. From humble beginnings, we’ve grown into a trusted brand with a loyal customer base, always staying
            true to our roots of quality and service.
          </p>
        </section>

        <section className="box">
          <h2>Our Mission</h2>
          <p>
            Our mission is simple: to be the most reliable source for high-performance computer parts, backed by expert
            support and unbeatable customer service. We strive to provide products that meet the demands of modern
            technology while ensuring that our customers have the knowledge and confidence to make the best decisions
            for their needs.
          </p>
        </section>

        <section className="box">
          <h2>Why Choose Us?</h2>
          <p>
            We go the extra mile. PixelParts offers a carefully curated selection of components to ensure that each
            product meets our high standards. With our tech expertise and passion for innovation, we help you build your
            ideal system, no matter your experience level.
          </p>
        </section>

        <section className="box">
          <h2>Contact Us</h2>
          <p>Feel free to reach out for any questions or advice. We’re here to help you find the right part for your needs!</p>
        </section>

        {/* Team Section */}
        <section className="box">
          <h2>Our Team</h2>
          <div className="image-gallery">
            <div className="image-container">
              <img src={team1Img} className="responsive-image" alt="Nick Milano" />
              <h3 className="name-title">Nick Milano</h3>
              <p>Nick Milano leads our Back-end Development team. He designed and created the MySQL database and oversaw the development of the backend functionality features.</p>
            </div>
            <div className="image-container">
              <img src={team2Img} className="responsive-image" alt="Steven Newbern" />
              <h3 className="name-title">Steven Newbern</h3>
              <p>Steven Newbern is the lead of our Front-end Development team. He worked on the homepage, JavaScript, and conducted competitor and market research.</p>
            </div>
            <div className="image-container">
              <img src={team5Img} className="responsive-image" alt="Tahreem Bhatti" />
              <h3 className="name-title">Tahreem Bhatti</h3>
              <p>Tahreem Bhatti is the Team Leader and Co-Developer. She worked on page templates, navigation, and collaborated on the product page with Marious.</p>
            </div>
            <div className="image-container">
              <img src={team3Img} className="responsive-image" alt="Alexander Simon" />
              <h3 className="name-title">Alexander Simon</h3>
              <p>Alexander Simon is the Web Designer and Co-Developer. He designed the website's layout and navigation, created the blog page, and conducted design research.</p>
            </div>
            <div className="image-container">
              <img src={team4Img} className="responsive-image" alt="Marious Yousif" />
              <h3 className="name-title">Marious Yousif</h3>
              <p>Marious Yousif is the Front-end Designer and Co-Developer. He worked on the product page, content planning, created a content calendar, and conducted SEO research.</p>
            </div>
          </div>
        </section>

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

export default AboutUs;
