import React, { useEffect, useState, useRef } from 'react';
import { useUser } from './UserContext';
import { useLocation, useNavigate } from 'react-router-dom'; 
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const ProductsPage = () => {
  const { user, loggedIn, logout } = useUser();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(); 
  const [localCart, setLocalCart] = useState(null);
  const [error, setError] = useState('');
  const [dropdownActive, setDropdownActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Featured Products');
  const [sorting, setSorting] = useState('Featured Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterFromURL = queryParams.get('filter');
  const isInitialLoad = useRef(true);

  // Fetch products for the current page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const totalProductsResponse = await fetch(`http://localhost:5000/api/products/count?filter=${selectedFilter}&searchTerm=${searchTerm}`);
        if (!totalProductsResponse.ok) {
          throw new Error(`Error fetching total products count: ${totalProductsResponse.status}`);
        }
        const totalProducts = await totalProductsResponse.json();
        setTotalPages(Math.ceil(totalProducts / 11));

        const response = await fetch(`http://localhost:5000/api/products?page=${currentPage}&limit=11&filter=${selectedFilter}&sort=${sorting}&searchTerm=${searchTerm}`);
        if (!response.ok) {
          throw new Error(`HTTP error Status: ${response.status}`);
        }
        const products = await response.json();
  
        // Fetch ratings for each product and update the product object with the rating
        const updatedProducts = await Promise.all(products.map(async (product) => {
          try {
            const ratingResponse = await fetch(`http://localhost:5000/api/products/rating/${product.idproduct}`);
            if (!ratingResponse.ok) {
              throw new Error('Failed to fetch average rating');
            }
            const rating = await ratingResponse.json();
            return { ...product, rating };  // Add the rating to the product object
          } catch (err) {
            console.error(`Error fetching rating for product ${product.idproduct}:`, err);
            return { ...product, rating: null }; // error = null rating
          }
        }));
        setProducts(updatedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error fetching products: ' + err.message);
      }
    };
  
    // Only fetch products if it's not the initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;  // Mark as not initial load after first load
    } else {
      fetchProducts();  // Fetch products when currentPage changes
    }
  }, [selectedFilter, currentPage, sorting, searchActive]);

  // Fetch cart information
  const fetchcartInfo = async () => {
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

      const orderCheck = await orderCheckResponse.json(); 

      // if active cart found set cart
      if (orderCheck) {
        setLocalCart(cartInfo); // Store current cart
      } else {
        // If no active cart create a new cart
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

  // Call the fetchcartInfo when the user is logged in
  useEffect(() => {
    if (loggedIn && user) {
      fetchcartInfo();
    }
  }, [loggedIn, user]);

  // Handle adding product to cart
  const handleAddToCart = async (product) => {
    if (!loggedIn) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    const cartitem = {
      cartitem_cartid: localCart.idcart,       
      cartitem_productid: product.idproduct,    
      quantity: 1, // Default quantity is 1
    };

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartitem }),
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

 // Dynamically pagination how many pages to show
  const getPages = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of pages to show
    let startPage = Math.max(1, currentPage - 2); // Show two previous pages if possible
    let endPage = Math.min(totalPages, currentPage + 2); // Show two next pages if possible

    // Adjust range to always show 5 pages if possible
    if (currentPage === 1) {
      // Show pages 1 through 5 when at the first page
      endPage = Math.min(totalPages, 5);
    } else if (currentPage === totalPages) {
      // Show pages (totalPages-4) through totalPages when at the last page
      startPage = Math.max(1, totalPages - 4);
    }

    // If there's a gap in the middle, adjust the range
    if (endPage - startPage < maxPagesToShow) {
      if (startPage > 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1); // Move startPage to the left if it's too small
      } else {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1); // Move endPage to the right if it's too small
      }
    }

    // Collect page numbers to show
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  useEffect(() => {
    if (filterFromURL) {
      setSelectedFilter(filterFromURL);
    }
  }, [filterFromURL]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // storing filter / page / storing on page change
    navigate(`?filter=${selectedFilter}&page=${page}&sort=${sorting}&searchTerm=${searchTerm}`);
  };

  const handleDropdownToggle = () => {
    setDropdownActive(prevState => !prevState);  // Toggle dropdown visibility
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setSorting('Featured Products');  // reset sorting to default "Featured Products"
    setSearchTerm('');
    setCurrentPage(1);  // Reset to page 1 when filter changes
    // handle filter change
    navigate(`?filter=${filter}&page=1&sort=Featured Products&searchTerm=''`);
  };

  // Handle sorting change
  const handleSortingChange = (sortType) => {
    setSorting(sortType);
    setDropdownActive(false);  // Close sorting dropdown menu when an option is selected
    // handle sorting sorting change
    navigate(`?filter=${selectedFilter}&page=${currentPage}&sort=${sortType}&searchTerm=${searchTerm}`);
  };

  useEffect(() => { // returns user back to the correct page / filter / sorting when returning from a product page
    // get the filter, sorting, and page from the URL
    const filterFromURL = queryParams.get('filter') || 'Featured Products';
    const pageFromURL = parseInt(queryParams.get('page')) || 1;
    const sortFromURL = queryParams.get('sort') || 'Featured Products';
  
    setSelectedFilter(filterFromURL);
    setSorting(sortFromURL);
    setCurrentPage(pageFromURL);
  }, [queryParams]);

  useEffect(() => {
    if (searchTerm === '') {
      setSearchActive(false);
    }

  }, [searchTerm]);
  
  // handle search bar submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchActive(true);  
    setCurrentPage(1); 
    setSorting('Featured Products');
    setSelectedFilter('Featured Products'); 
    navigate(`?filter=Featured Products&page=1&sort=Featured Products&searchTerm=${searchTerm}`);
  };
  
  return (
    <div className="products-page">
      <section id="header">
        <a href="/"><img src={logoImg} className="logo" alt="PixelParts Logo" /></a>
        <div>
          <ul id="navbar">
            <li><a href="/">Home</a></li>
            <li className="dropdown">
              <a href="/products" className="active">Products</a>
              <ul className="dropdown-content">
                <li><a href="#" onClick={() => handleFilterChange('Processors')}>Processors</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Motherboards')}>Motherboards</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Graphics Cards')}>Graphics Cards</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Memory')}>Memory</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Storage')}>Storage</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Power Supplies')}>Power Supplies</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Cooling and Lighting')}>Cooling and Lighting</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Cases')}>Cases</a></li>
                <li><a href="#" onClick={() => handleFilterChange('Peripherals and Accessories')}>Peripherals and Accessories</a></li>
              </ul>
            </li>
            <li><a href="/aboutus">About Us</a></li>
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
          <form role="search" method="get" className="search-form" onSubmit={handleSearch}>
            <label>
              <input 
                type="search" 
                className="search-field" 
                placeholder="Search..." 
                name="s" 
                title="Search for:" 
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <input type="submit" className="search-submit" value="Search" />
          </form>
          {loggedIn && (
            <a href="/user/cart" className="cart-icon">
              <img src={cartIcon} alt="Cart" className="cart-icon-img" />
            </a>
          )}
        </div>
      </section>

      <section id="product1" className="product-padding">
      <h2 style={{ fontSize: '48px' }}>
        {searchActive ? `Results for "${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase()}"` : selectedFilter} 
        </h2>
        {/* Dropdown Filter */}
        <div className={`filter-dropdown ${dropdownActive ? 'active' : ''}`}>
          <button className="filter-btn" onClick={handleDropdownToggle}>Sort Products</button>
          <div className="filter-dropdown-content">
            <a href="#" onClick={() => handleSortingChange('Featured Products')}>Featured Products</a>
            <a href="#" onClick={() => handleSortingChange('priceAsc')}>Price: Asc</a>
            <a href="#" onClick={() => handleSortingChange('priceDesc')}>Price: Desc</a>
            <a href="#" onClick={() => handleSortingChange('manuDesc')}>Manufacturer: A to Z</a>
            <a href="#" onClick={() => handleSortingChange('manuAsc')}>Manufacturer: Z to A</a>
          </div>
        </div>
        <div className="product-container">
    {products.length === 0 ? (
      <p style={{ fontSize: '35px' }}>No results found for "{searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase()}"<br></br> Please try again with different keywords</p>
    ) : (
      products.map((product) => (
        <div className="product" key={product.idproduct}>
          <a href={`/products/description/${product.idproduct}`}>
            <img src={`/assets/${product.image}`} alt={product.name} />
            <div className="description">
              <span>{product.manufacturer}</span>
              <h5>{product.name}</h5>
              {product.rating === 'No Rating' ? (
                <span className="no-rating">(No Rating)</span>
              ) : (
                <div className="star">
                  <i className={`fas fa-star${product.rating >= 1 ? '' : ' invisible'}`}></i>
                  <i className={`fas fa-star${product.rating >= 2 ? '' : ' invisible'}`}></i>
                  <i className={`fas fa-star${product.rating >= 3 ? '' : ' invisible'}`}></i>
                  <i className={`fas fa-star${product.rating >= 4 ? '' : ' invisible'}`}></i>
                  <i className={`fas fa-star${product.rating >= 5 ? '' : ' invisible'}`}></i>
                </div>
              )}
              <h4>${product.price}</h4>
            </div>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
            <img src={cartIcon} alt="Cart" className="cart-icon-img" style={{ width: '30px', height: '30px', position: 'absolute', bottom: '20px', right: '10px' }} />
          </a>
        </div>
          )))}
        </div>
      </section>

      {/* Pagination Controls */}
      <div id="pagination-controls">
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button arrow-button"
        >
          &lt;
        </button>

        {getPages().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}  // Disable the right arrow if there are no more pages
          className="pagination-button arrow-button"
        >
          &gt;
        </button>
      </div>


      {/* Footer */}
      <footer className={products.length === 0 ? 'fixedproducts-footer' : 'products-footer'}>
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

export default ProductsPage;
