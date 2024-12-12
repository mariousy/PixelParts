import React from 'react';
import facebookIcon from './assets/facebook.png'; 
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import graphicsCardImg from './assets/graphicsCard.jpg';
import motherboardImg from './assets/motherboards.jpg';
import processorImg from './assets/processors.jpg';
import accessoriesImg from './assets/accessories.jpg';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import headerImg from './assets/white-pc-build.jpg';
import './styles.css'; 
import { useUser } from './UserContext';

const HomePage = () => {
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

            {/* Main Introduction */}
            <div>
                <h1>PixelParts</h1>
                <h2>An online store designed for anyone who wants to find the best computer parts.</h2>
            </div>

            {/* Header Image */}
            <img className="home-image" src={headerImg} alt="PC Build" />

            {/* Why Shop Section */}
            <div>
                <h2>Why Shop With Us?</h2>
                <p className="home-p2">
                    At PixelParts, we make building and upgrading your PC easy and affordable. Whether you're a seasoned PC enthusiast or a first-time builder, our carefully curated selection of high-quality computer components ensures you’ll find exactly what you need. From cutting-edge processors and graphics cards to reliable motherboards and cooling solutions, we've got you covered.
                    With fast shipping, dedicated customer support, and unbeatable prices, PixelParts is your one-stop shop for all things PC.
                </p>
            </div>

            {/* Card Section */}
            <section className="card-container">
                <a href="/products?filter=Graphics Cards" className="card-link">
                    <div className="card">
                        <img src={graphicsCardImg} alt="Graphics Cards" className="card-image" />
                        <div className="card-content">
                            <h3 className="card-title">Graphics Cards</h3>
                            <p className="card-text">Find top-tier GPUs to boost your gaming experience.</p>
                        </div>
                    </div>
                </a>
                <a href="/products?filter=Motherboards" className="card-link">
                    <div className="card">
                        <img src={motherboardImg} alt="Motherboards" className="card-image" />
                        <div className="card-content">
                            <h3 className="card-title">Motherboards</h3>
                            <p className="card-text">Reliable motherboards to connect your essential components.</p>
                        </div>
                    </div>
                </a>
                <a href="/products?filter=Processors" className="card-link">
                    <div className="card">
                        <img src={processorImg} alt="Processors" className="card-image" />
                        <div className="card-content">
                            <h3 className="card-title">Processors</h3>
                            <p className="card-text">High-performance CPUs for your custom PC builds.</p>
                        </div>
                    </div>
                </a>
                <a href="/products?filter=Peripherals and Accessories" className="card-link">
                    <div className="card">
                        <img src={accessoriesImg} alt="Peripherals and Accessories" className="card-image" />
                        <div className="card-content">
                            <h3 className="card-title">Peripherals and Accessories</h3>
                            <p className="card-text">Enhance your setup with the latest PC accessories.</p>
                        </div>
                    </div>
                </a>
            </section>

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

export default HomePage;
