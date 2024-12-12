import React from 'react';
import facebookIcon from './assets/facebook.png'; 
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import './styles.css'; 
import { useUser } from './UserContext';

const TermsOfService = () => {
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

            {/* Terms of Service Section */}
            <div className="text-sections">
                <section className="box">
                    <h1>Terms of Service</h1>
                    <p><strong>Effective Date: 12/01/2024</strong></p>
                    <div className="contact-form">
                        <p>Welcome to Pixel Parts! By accessing or using our website, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.</p>
                        <hr />

                        <h2>1. Acceptance of Terms</h2>
                        <p>By visiting, browsing, or purchasing from Pixel Parts, you accept and agree to these Terms of Service, our Privacy Policy, and any additional policies referenced herein.</p>

                        <h2>2. Eligibility</h2>
                        <ul>
                            <li>Be at least 18 years of age or have parental/guardian consent.</li>
                            <li>Provide accurate, current, and complete information during the account creation and checkout processes.</li>
                        </ul>

                        <h2>3. Account Responsibilities</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>

                        <h2>4. Purchases</h2>
                        <h3>4.1 Product Descriptions</h3>
                        <p>We strive to ensure product descriptions and specifications are accurate, but we do not guarantee their completeness or reliability. If you receive a product that materially differs from its description, you may return it in accordance with our Return Policy.</p>

                        <h3>4.2 Pricing</h3>
                        <p>All prices are listed in USD and are subject to change without notice. We reserve the right to correct pricing errors and to refuse or cancel orders placed at incorrect prices.</p>

                        <h3>4.3 Payment</h3>
                        <p>Payment must be made at the time of purchase via accepted payment methods. We use secure third-party payment processors and do not store payment information on our servers.</p>

                        <h2>5. Shipping</h2>
                        <p>We ship to the US only. Shipping times and costs vary based on your location and chosen method. Estimated delivery dates are not guaranteed.</p>

                        <h2>6. Prohibited Activities</h2>
                        <ul>
                            <li>Use the website for any unlawful purpose.</li>
                            <li>Engage in fraudulent activities, including unauthorized use of payment methods.</li>
                            <li>Attempt to interfere with the website’s functionality or security.</li>
                            <li>Resell purchased products without prior written consent.</li>
                        </ul>

                        <h2>7. Intellectual Property</h2>
                        <p>All content on Pixel Parts, including logos, text, images, and software, is the property of Pixel Parts or its licensors and is protected by copyright and other intellectual property laws. You may not use this content without prior written permission.</p>

                        <h2>8. Disclaimer of Warranties</h2>
                        <p>Pixel Parts is provided "as is" and "as available." We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>

                        <h2>9. Limitation of Liability</h2>
                        <p>To the fullest extent permitted by law, Pixel Parts and its affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or products purchased.</p>

                        <h2>10. Indemnification</h2>
                        <p>You agree to indemnify and hold harmless Pixel Parts, its affiliates, and employees from any claims, damages, or expenses arising from your violation of these Terms of Service.</p>

                        <h2>11. Changes to Terms</h2>
                        <p>We reserve the right to update these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the updated terms.</p>

                        <h2>12. Governing Law</h2>
                        <p>These Terms of Service shall be governed by the laws of the United States of America.</p>

                        <h2>13. Contact Us</h2>
                        <p>For questions or concerns regarding these Terms of Service, contact us at:</p>
                        <p>
                            Email: team.pixelparts@gmail.com<br />
                            Mailing Address: <br />
                            Pixel Parts <br />
                            115 Library Dr <br />
                            Rochester, MI 48309
                        </p>

                        <p>Thank you for choosing Pixel Parts!</p>
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

export default TermsOfService;
