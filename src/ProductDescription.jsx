import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useParams } from 'react-router-dom';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const ProductDescription = () => {
  const { productId } = useParams(); 
  const { user, loggedIn, logout } = useUser();
  const [product, setProduct] = useState(null);
  const [localCart, setLocalCart] = useState(null);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState(null); 
  const [smallImages, setSmallImages] = useState([]); 
  const [quantity, setQuantity] = useState(1);
  const [avgRating, setRating] = useState('');

  // Fetch product details based on productId
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data); 
        setMainImage(data.image);
        const images = [data.image2, data.image3, data.image4, data.image5].filter(Boolean);
        setSmallImages(images); 
      } catch (err) {
        setError('Error fetching product details: ' + err.message);
      }
    };

    const fetchRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/rating/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch average rating');
        }
        const rating = await response.json();
        console.log("rating:", rating)
        setRating(rating);
      } catch (err) {
        setError('Error fetching average rating: ' + err.message);
      }
    };

    fetchProductDetails();
    fetchRating();
  }, [productId]);

  // Fetch cart information
  const fetchCartInfo = async () => {
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

      const orderCheckResponse = await fetch('http://localhost:5000/api/cart/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: { idcart: cartInfo.idcart } }),
      });

      if (!orderCheckResponse.ok) {
        throw new Error(`Error checking active cart: ${orderCheckResponse.status}`);
      }

      const orderCheck = await orderCheckResponse.json(); // Get the result of the check

      // If the orderCheck indicates an active cart then set the cart
      if (orderCheck) {
        setLocalCart(cartInfo); // Store current cart
      } else {
        // If no active cart, create a new cart
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

        const newCartInfo = await newCartResponse.json();
        setLocalCart(newCartInfo); // Set the new cart
      }
    } catch (err) {
      setError('Error fetching cart: ' + err.message);
    }
  };

  // Call the fetchCartInfo when the user is logged in
  useEffect(() => {
    if (loggedIn && user) {
      fetchCartInfo();
    }
  }, [loggedIn, user]);

  // Handle adding product to cart
  const handleAddToCart = async () => {
    if (!loggedIn) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    if (!localCart) {
      alert('No active cart found. Please create a new cart.');
      return;
    }

    // create the cart item object
    const cartitem = {
      cartitem_cartid: localCart.idcart,
      cartitem_productid: product.idproduct,
      quantity: quantity,
    };

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartitem }), // Send the correct object
      });

      const data = await response.json();

      if (data.success) {
        console.log('Product added to cart');
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleSmallImageClick = (image) => {
    setSmallImages((prevSmallImages) => {
      const index = prevSmallImages.indexOf(image);
      if (index !== -1) {
        const newSmallImages = [...prevSmallImages];
        newSmallImages[index] = mainImage; // Swap the clicked small image with the main image
        return newSmallImages;
      }
      return prevSmallImages;
    });
    setMainImage(image); // Update the main image to the clicked small image
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }


  return (
    <div className="products-page">
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

      {/* Product Detail Section */}
      <section className="product-detail">
        {/* Product Images Section */}
        <div className="product-images">
          <img
            src={`/assets/${mainImage}`}  // Display the main image
            alt={product.name}
            className="main-image"
          />
          <div className="small-images">
            {smallImages.map((image, index) => (
              <img
                key={index}
                src={`/assets/${image}`}  // Small product image
                alt={`Product Small ${index + 1}`}
                className="small-img"
                onClick={() => handleSmallImageClick(image)} // Set main image to clicked image
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="card-container-desc">
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price">${product.price}</p>
            
            {/* Star display */}
            <a href={`/products/reviews/${productId}`} style={{ textDecoration: 'none' }}>
              {avgRating === 'No Rating' ? ( 
                <span style={{ fontFamily: 'Arial', fontStyle: 'italic', textDecoration: 'underline'}}>(Review this Product)</span>
              ) : (
                <div className="star"> 
                  <i className={`fas fa-star${avgRating >= 1 ? '' : ' invisible'}`}></i> 
                  <i className={`fas fa-star${avgRating >= 2 ? '' : ' invisible'}`}></i>
                  <i className={`fas fa-star${avgRating >= 3 ? '' : ' invisible'}`}></i>
                  <i className={`fas fa-star${avgRating >= 4 ? '' : ' invisible'}`}></i>
                  <i className={`fas fa-star${avgRating >= 5 ? '' : ' invisible'}`}></i>
                  <i style={{ fontFamily: 'Arial', fontStyle: 'italic' }}>
                    {avgRating}/5 (Read Reviews)
                  </i>
                </div>
              )}
            </a>
            <p className="description">{product.description}</p>
            <label htmlFor="quantity">Quantity: </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
            
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='description-footer'>
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

export default ProductDescription;
