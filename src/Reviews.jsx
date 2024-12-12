import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useParams } from 'react-router-dom';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const Reviews = () => {
  const { productId } = useParams();
  const { user, loggedIn, logout } = useUser();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [smallImages, setSmallImages] = useState([]);
  const [rating, setRating] = useState('');
  const [reviewInfo, setReviewInfo] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [previousReviews, setPreviousReviews] = useState([]);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => { // get product information to display
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

    const fetchReviews = async () => { // get all the previous reviews for the product
      try {
        const response = await fetch(`http://localhost:5000/api/products/reviews/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error Status: ${response.status}`);
        }
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const reviewsData = await response.json();
        setPreviousReviews(reviewsData);
      } catch (err) {
        setError('Error fetching reviews: ' + err.message);
      }
    };

    fetchProductDetails();
    fetchReviews();
  }, [productId, refreshReviews]);

  const handleSmallImageClick = (image) => { // make the main image switch with the smaller image for better viewing
    setSmallImages((prevSmallImages) => {
      const index = prevSmallImages.indexOf(image);
      if (index !== -1) {
        const newSmallImages = [...prevSmallImages];
        newSmallImages[index] = mainImage; 
        return newSmallImages;
      }
      return prevSmallImages;
    });
    setMainImage(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !reviewInfo) {
      setSubmitError('Both rating and review are required.');
      return;
    }
    
    const fullname = user.firstname + ' ' + user.lastname;
    const review = { // form review object with the inputted information
      review_productid: productId,
      fullname: fullname,
      rating,
      reviewinfo: reviewInfo,
    };

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      console.log('Review submitted successfully:', result);
      setRating('');
      setReviewInfo('');
      setSubmitError('');
      setRefreshReviews(true); // make the previous reviews refresh to display the new review just entered
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitError('There was an error submitting your review.');
    }
  };

  return (
    <div className="products-page">
      {/* Header Section */}
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
            {user && user.iduser === 1 && (
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

      <section id="reviews-details" className="reviews-details">
        <div className="review-left-card">
          {product ? (
            <>
              <h1 className="review-title">{product.name}</h1>
              <div className="reviews-images">
                <div className="review-main-image-container">
                  <img src={`/assets/${mainImage}`} alt={product.name} className="review-main-image"/>
                </div>
                <div className="review-small-images">
                  {smallImages.map((image, index) => (
                    <img
                      key={index}
                      src={`/assets/${image}`}
                      alt={`product-thumbnail-${index}`}
                      className="review-small-image"
                      onClick={() => handleSmallImageClick(image)}
                    />
                  ))}
                </div>
              </div>
              <h2 style={{ marginTop: '20px', marginBottom: '-20px' }}>Create a Review</h2>
              <form id="review-form" onSubmit={handleSubmit}>
                {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
                <label htmlFor="rating">Rating:</label>
                <select
                  id="rating"
                  name="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                <label htmlFor="review">Your Review:</label>
                <textarea
                  id="review"
                  name="review"
                  rows="5"
                  placeholder="Write your review here..."
                  value={reviewInfo}
                  onChange={(e) => setReviewInfo(e.target.value)}
                  required
                />
                <button type="submit">Submit Review</button>
              </form>
            </>
          ) : (
            <p>{error ? error : 'Loading product details...'}</p>
          )}
        </div>

        {/* Previous reviews */}
        <div className="review-right-card">
          <h3 className="review-title">Previous Reviews</h3>
          <div id="reviews-list">
            {previousReviews.length > 0 ? (
              previousReviews.map((review) => (
                <div key={review.idreview} className="review">
                  <p>
                    <strong>{review.fullname}</strong> (Rating: {review.rating}/5)
                  </p>
                  <p>{review.reviewinfo}</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '36px', textAlign: 'center', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '10px 0', marginTop: '300px' }}>
                No reviews<br></br> Be the first to leave a review!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="reviews-footer">
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

export default Reviews;
