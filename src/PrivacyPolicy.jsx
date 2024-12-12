import React from 'react';
import facebookIcon from './assets/facebook.png'; 
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import './styles.css'; 
import { useUser } from './UserContext';

const PrivacyPolicy = () => {
    const { user, loggedIn, logout } = useUser(); 

    return (
        <div className="home-body">
            {/* Header Section */}
            <section id="header">
                <a href="/"><img src={logoImg} className="logo" alt="PixelParts Logo" /></a>
                <div>
                    <ul id="navbar">
                        <li><a href="/" className="active">Home</a></li>
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
            </section>

            {/* Main Content Section */}
            <div className="text-sections">
                <section className="box">
                    <div className="contact-form">
                        <h1>Privacy Policy</h1>
                        <p><strong>Effective Date: 12/01/2024</strong></p>

                        <p>Your privacy is important to us. This Privacy Policy outlines how Pixel Parts collects, uses, and protects your personal information.</p>

                        <hr />

                        <h2>1. Information We Collect</h2>
                        <h3>1.1 Personal Information</h3>
                        <p>When you create an account, make a purchase, or contact us, we may collect information such as your name, email address, phone number, billing address, and payment details.</p>

                        <h3>1.2 Non-Personal Information</h3>
                        <p>We may collect non-personal information such as browser type, IP address, and browsing behavior on our website.</p>

                        <h2>2. How We Use Your Information</h2>
                        <ul>
                            <li>To process and fulfill your orders.</li>
                            <li>To communicate with you about your account or transactions.</li>
                            <li>To improve our website, products, and services.</li>
                            <li>To comply with legal obligations.</li>
                        </ul>

                        <h2>3. Sharing of Information</h2>
                        <p>We do not sell your personal information. However, we may share your information with trusted third parties such as payment processors, shipping partners, and service providers to fulfill orders and improve our services.</p>

                        <p>We may also disclose your information if required by law or to protect our rights and property.</p>

                        <h2>4. Cookies and Tracking Technologies</h2>
                        <p>We use cookies and similar technologies to enhance your browsing experience and gather data about website usage. You can manage your cookie preferences in your browser settings.</p>

                        <h2>5. Data Security</h2>
                        <p>We implement security measures to protect your personal information. However, no method of transmission or storage is completely secure. Use our website at your own risk.</p>

                        <h2>6. Your Rights</h2>
                        <p>You have the right to access, update, or delete your personal information. Contact us at [Insert Contact Information] to exercise your rights.</p>

                        <h2>7. Changes to This Privacy Policy</h2>
                        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated effective date. Please review it periodically.</p>

                        <h2>8. Contact Us</h2>
                        <p>If you have questions or concerns about this Privacy Policy, contact us at:</p>
                        <p>
                            Email: team.pixelparts@gmail.com<br />
                            Mailing Address: <br /> Pixel Parts <br />
                            115 Library Dr <br />
                            Rochester, MI 48309
                        </p>

                        <p>Thank you for trusting Pixel Parts with your personal information!</p>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="home-footer">
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

export default PrivacyPolicy;
