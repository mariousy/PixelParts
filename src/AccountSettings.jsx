import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import logoImg from './assets/pixelparts.png';
import cartIcon from './assets/cart.png';
import facebookIcon from './assets/facebook.png';
import instagramIcon from './assets/instagram.png';
import twitterIcon from './assets/twitter.png';
import './styles.css';

const AccountSettings = () => {
  const { user, loggedIn, logout, login } = useUser();
  const [activeTab, setActiveTab] = useState('view');
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    streetaddress: '',
    city: '',
    state: '',
    zip: '',
    cellphone: ''
  });
  const [selectedField, setSelectedField] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (user) {
      setUserDetails({
        iduser: user.iduser || '',
        email: user.email || '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        streetaddress: user.streetaddress || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        cellphone: user.cellphone || ''
      });
    }
  }, [user]);

  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
  };

  const handleValueChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedUser = { ...userDetails, [selectedField]: newValue }; 
    setUserDetails(updatedUser); 
    login(updatedUser);
  
    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.iduser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: updatedUser,
          field: selectedField,
        }), 
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      const result = await response.json();
      setSelectedField('');  // Clear selected field
      setNewValue('');       // Clear the new value input
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  return (
    <div className="account-page">
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
                          <a href="/account/settings" className="active">Hello, {user && user.firstname ? user.firstname : "User"}</a>
                          <ul className="dropdown-content">
                              <li><a href="/account/settings">Account Settings</a></li>
                              <li><a href="/account/orders">Orders</a></li>
                              <li><button onClick={logout} className="logout-button">Logout</button></li>
                          </ul>
                      </li>
                  ) : (
                      <li><a href="/login" >Login</a></li>
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

      {/* Account Settings Page */}
      <main className="account-settings-body">
        <div className="login-container">
          <div className="tab-buttons">
            <button className={activeTab === 'view' ? 'active' : ''} onClick={() => setActiveTab('view')}>Account Information</button>
            <button className={activeTab === 'edit' ? 'active' : ''} onClick={() => setActiveTab('edit')}>Edit Information</button>
          </div>

          {activeTab === 'view' ? (
            <div className="view-info">
              <h2 className="section-title">Account Information</h2> 
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>First Name:</strong> {userDetails.firstname}</p>
              <p><strong>Last Name:</strong> {userDetails.lastname}</p>
              <p><strong>Street Address:</strong> {userDetails.streetaddress}</p>
              <p><strong>City:</strong> {userDetails.city}</p>
              <p><strong>State:</strong> {userDetails.state}</p>
              <p><strong>Zip:</strong> {userDetails.zip}</p>
              <p><strong>Cellphone:</strong> {userDetails.cellphone}</p>
            </div>
          ) : (
            <div className="edit-info">
              <h2 className="section-title">Edit Account Information</h2> 
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="field">Select field to update:</label>
                  <select
                    id="field"
                    name="field"
                    value={selectedField}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">-- Select Field --</option>
                    <option value="email">Email</option>
                    <option value="password">Password</option>
                    <option value="firstname">First Name</option>
                    <option value="lastname">Last Name</option>
                    <option value="streetaddress">Street Address</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                    <option value="zip">Zip</option>
                    <option value="cellphone">Cellphone</option>
                  </select>
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
                <button className="submit-btn">Update Information</button>
              </form>
            </div>
          )}
        </div>
      </main>


      {/* Footer */}
      <footer className="account-settings-footer">
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

export default AccountSettings;
