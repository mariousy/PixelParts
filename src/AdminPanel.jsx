import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const AdminPanel = () => {
  const { user, loggedIn, logout } = useUser();
  const [activeTab, setActiveTab] = useState('add');
  const [productDetails, setProductDetails] = useState({
    manufacturer: '',
    name: '',
    description: '',
    category: '',
    price: '',
    stockquantity: '',
    intendeduse: '',
    image: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null
  });
  const [selectedField, setSelectedField] = useState('');
  const [newValue, setNewValue] = useState('');
  const [productId, setProductId] = useState('');

  // Reset variables when tab is changed
  useEffect(() => {
    setProductDetails({
      manufacturer: '',
      name: '',
      description: '',
      category: '',
      price: '',
      stockquantity: '',
      intendeduse: '',
      image: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
    }); 
    setProductId('');
    setSelectedField('');
  }, [activeTab]); 
  
  const handleProductChange = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
  };

  const handleValueChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleProductIdChange = (e) => {
    setProductId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === 'add') {
      const formData = new FormData();
      formData.append('manufacturer', productDetails.manufacturer);
      formData.append('name', productDetails.name);
      formData.append('description', productDetails.description);
      formData.append('category', productDetails.category);
      formData.append('intendeduse', productDetails.intendeduse);
      formData.append('price', productDetails.price);
      formData.append('stockquantity', productDetails.stockquantity);
      if (productDetails.image) {
        formData.append('image', productDetails.image);
      }
      if (productDetails.image2) {
        formData.append('image2', productDetails.image2);
      }
      if (productDetails.image3) {
        formData.append('image3', productDetails.image3);
      }
      if (productDetails.image4) {
        formData.append('image4', productDetails.image4);
      }
      if (productDetails.image5) {
        formData.append('image5', productDetails.image5);
      }
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const newProduct = await response.json();
          console.log('Product added successfully:', newProduct);
          window.location.reload(); // clears the text fields
        } else {
          console.error('Error adding product');
        }
      } catch (err) {
        console.error('Error sending request:', err);
      }
    } else if (activeTab === 'delete') {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          setProductId(''); // Reset the productId state to clear the input field
        } else {
          console.error('Error deleting product');
        }
      } catch (err) {
        console.error('Error sending delete request:', err);
      }
    } else if (activeTab === 'edit') {
      if (!productId || !selectedField || !newValue) {
        alert('Please fill all fields');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: selectedField,
            value: newValue,
          }),
        });
        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          setProductId(''); // reset fields
          setSelectedField(''); // reset fields
          setNewValue(''); // reset fields
        } else {
          console.error('Error updating product');
          alert('Error updating product');
        }
      } catch (err) {
        console.error('Error updating product:', err);
        alert('Error updating product');
      }
    } else if (activeTab === 'get') {
      if (!productId) {
        console.error('No product ID entered');
        return; // Exit early if no product ID is entered
      }
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'GET', // Use GET method
        });
        if (response.ok) {
          const product = await response.json();
          console.log('Fetched product:', product);
          setProductDetails(product);
        } else {
          console.error('Error fetching product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    }
  };

  return (
    <div className="admin-page">
      {/* Header Section */}
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
            {user && user.iduser === 1 && ( // Admin access
              <li><a href="/admin" className='active'>Admin Panel</a></li>
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

      {/* Admin Product Management */}
      <main className="admin-settings-body">
        <div className="admin-container">
          <div className="tab-buttons">
            <button className={activeTab === 'add' ? 'active' : ''} onClick={() => setActiveTab('add')}>Add Product</button>
            <button className={activeTab === 'get' ? 'active' : ''} onClick={() => setActiveTab('get')}>Get Product</button>
            <button className={activeTab === 'delete' ? 'active' : ''} onClick={() => setActiveTab('delete')}>Delete Product</button>
            <button className={activeTab === 'edit' ? 'active' : ''} onClick={() => setActiveTab('edit')}>Update Product</button>
          </div>
          {activeTab === 'add' ? (
            <div className="add-product">
              <h2 className="section-title">Add New Product</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="manufacturer">Manufacturer:</label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    value={productDetails.manufacturer}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productDetails.name}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description">Description:</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={productDetails.description}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category">Category:</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={productDetails.category}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="intendeduse">Intended Use:</label>
                  <input
                    type="text"
                    id="intendeduse"
                    name="intendeduse"
                    value={productDetails.intendeduse}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price:</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={productDetails.price}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="stockquantity">Stock Quantity:</label>
                  <input
                    type="text"
                    id="stockquantity"
                    name="stockquantity"
                    value={productDetails.stockquantity}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="image">Main Image (All images must be JPG):</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="image2">Image 2:</label>
                  <input
                    type="file"
                    id="image2"
                    name="image2"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="image3">Image 3:</label>
                  <input
                    type="file"
                    id="image3"
                    name="image3"
                    onChange={handleImageChange}
                    required
                  />
                  <div>
                  <label htmlFor="image4">Image 4:</label>
                  <input
                    type="file"
                    id="image4"
                    name="image4"
                    onChange={handleImageChange}
                    required
                  />
                  <div>
                  <label htmlFor="image5">Image 5:</label>
                  <input
                    type="file"
                    id="image5"
                    name="image5"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                </div>
                </div>
                <button className="submit-btn">Add Product</button>
              </form>
            </div>
          ) : activeTab === 'get' ? (
            <div className="get-product">
              <h2 className="section-title">Get Product</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="productId">Product ID:</label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    value={productId}
                    onChange={handleProductIdChange}
                    required
                  />
                </div>
                <button className="submit-btn">Get Product</button>
                {productDetails && (
                <div className="product-info-admin">
                  <h3><strong>Product Information </strong></h3>
                  <p><strong>Manufacturer: </strong>{productDetails.manufacturer}</p>
                  <p><strong>Name: </strong>{productDetails.name}</p>
                  <p><strong>Description: </strong>{productDetails.description}</p>
                  <p><strong>Category: </strong>{productDetails.category}</p>
                  <p><strong>Price: </strong>{productDetails.price}</p>
                  <p><strong>Stock Quantity: </strong>{productDetails.stockquantity}</p>
                  <p><strong>Intended Use: </strong>{productDetails.intendeduse}</p>
                  <p><strong>Images:</strong></p>
                  <div>
                    {productDetails.image && <img src={`/assets/${productDetails.image}`} alt="Product Image" className="product-image" />}
                    {productDetails.image2 && <img src={`/assets/${productDetails.image2}`} alt="Product Image 2" className="product-image" />}
                    {productDetails.image3 && <img src={`/assets/${productDetails.image3}`} alt="Product Image 3" className="product-image" />}
                    {productDetails.image4 && <img src={`/assets/${productDetails.image4}`} alt="Product Image 4" className="product-image" />}
                    {productDetails.image5 && <img src={`/assets/${productDetails.image5}`} alt="Product Image 5" className="product-image" />}
                  </div>
                </div>
              )}
              </form>
            </div>
          ) : activeTab === 'delete' ? (
            <div className="delete-product">
              <h2 className="section-title">Delete Product</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="productId">Product ID:</label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    value={productId}
                    onChange={handleProductIdChange}
                    required
                  />
                </div>
                <button className="submit-btn">Delete Product</button>
              </form>
            </div>
          ) : (
            <div className="update-product">
              <h2 className="section-title">Update Product</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="field">Select Field to Update:</label>
                  <select
                    id="field"
                    name="field"
                    value={selectedField}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">-- Select Field --</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="name">Name</option>
                    <option value="description">Description</option>
                    <option value="category">Category</option>
                    <option value="intendeduse">Intended Use</option>
                    <option value="price">Price</option>
                    <option value="stockquantity">Stock Quantity</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="productId">Product ID:</label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    value={productId}
                    onChange={handleProductIdChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newValue">Updated Information:</label>
                  <input
                    type="text"
                    id="newValue"
                    name="newValue"
                    value={newValue}
                    onChange={handleValueChange}
                    required
                  />
                </div>
                <button className="submit-btn">Update Product</button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className= "adminpanel-footer">
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

export default AdminPanel;
