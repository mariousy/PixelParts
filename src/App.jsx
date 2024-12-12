import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Home';
import LoginPage from './Login';
import ContactPage from './Contact';
import ProductsPage from './Products';
import BlogsPage from './blog';
import AboutUs from './AboutUs';
import ShippingPage from './ShippingPage';
import ProductDescription from './ProductDescription';
import Cart from './Cart'; 
import { UserProvider } from './UserContext';
import CheckoutPage from './CheckoutPage';
import AccountSettings from './AccountSettings';
import AdminPanel from './AdminPanel';
import Orders from './Orders';
import OrderDetails from './OrderDetails';
import Reviews from './Reviews';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy'

function App() {
  return (
    <UserProvider> 
      <Router
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/user" element={<ProductsPage />} /> 
          <Route path="/blog" element={<BlogsPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/user/cart" element={<Cart />} /> 
          <Route path="/user/cart/checkout" element={<CheckoutPage />} /> 
          <Route path="/user/cart/checkout/shipping" element={<ShippingPage />} />
          <Route path="/products/description/:productId" element={<ProductDescription />} />
          <Route path="/account/settings" element={<AccountSettings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/account/orders" element={<Orders />} />
          <Route path="/account/orders/details/:orderId" element={<OrderDetails />} />
          <Route path="/products/reviews/:productId" element={<Reviews />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
