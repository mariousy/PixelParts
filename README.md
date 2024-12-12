# PixelParts Website Guide

---

## Dependencies / Configuration
Before you start your PixelParts experience, please follow these steps:
  1. Install Node.js
    - You must have Node.js installed to run the website. If you do not already have it installed, please visit https://nodejs.org/en/download/package-manager to install it.
  2. Clone our Repository
    - Open a CMD window and navigate to the folder where you would like to store the website.
      - Run the following commands:
        - git clone https://github.com/T-Bhatti13/PixelPart.git
        - cd  PixelPart
  3. Install Dependencies
    - Now that you are in the PixelPart directory, run the following command to install all the required dependencies:
      - npm intall
  4. Running PixelParts
    - PixelParts is now set up and ready for use! To launch the website, run the following commnad:
      - npm run start
  5. Access the Website
     - Open the website on any browser by navigating to the followign URL:
       - http://localhost:5173/

---

## Introduction
Welcome to PixelParts! We are an online store offering high-quality products for all your PC building needs. This guide will walk you through the website’s features, from browsing products to managing your account and completing purchases.

---

### Navigation Bar & Footer

- **Navigation Bar**: Quick access to key sections of the website:
  - **Home**
  - **Products**
    - Click **Products** to view all products.
    - Hover over **Products** to reveal a dropdown menu with the following categories:
        - Processors
        - Motherboards
        - Graphics Cards
        - Memory
        - Storage
        - Power Supplies
        - Cooling and Lighting
        - Cases
        - Peripherals and Accessories
  - **About Us**
  - **Blog**
  - **Contact Us**
  - **Login / Account**
    - After logging in, the Account dropdown gives access to:
      - Account Settings
      - Orders
      - Logout
  - **Admin Panel** (Only visible to admin accounts)
  - **Search button/box** (Only visible on the Products page)
  - **Cart**
  
- **Footer**: Contains important links:
  - About Us
  - Privacy Policy
  - Terms of Service
  - Social Media Accounts

---

### ◯ Homepage
- **Overview**: The homepage serves as our landing and welcome page. Here, you'll find our mission statement, which outlines our commitment to providing high-quality products and clear, detailed information. You'll also find links to categories that guide you to our most popular product pages, making it easy to explore and shop.

---

### ◯ Products Page
- **Browsing Products**: Use the dropdown menu to explore various categories like:
  - Processors
  - Motherboards
  - Graphics Cards
  - Memory
  - Storage
  - Power Supplies
  - Cooling and Lighting
  - Cases
  - Peripherals and Accessories
- **Sort Products**: Sort by:
  - Featured Products
  - Price Ascending
  - Price Descending
  - Manufacturer A-Z
  - Manufacturer Z-A

- **Product Details**: Click any product for a details page with:
  - Product Name
  - Description
  - More Images
  - Average Rating (Click to view previous reviews)
  - Pricing
    
- **Adding to Cart**:  
  - **From the General Product Page**: Click the cart icon to add the item.
  - **From the Detailed Product Page**: Set a custom quantity (default is 1) and click "Add to Cart."

---

### ◯ Reviews / Ratings
- **From the General Product Page**: Stars are used to display the current average rating of each product.
- **From the Detailed Product Page**: Click the stars to be taken to the review page for the product where you can:
  - Write a review for the product.
  - Read all the previous reviews for the product. 

---

### ◯ Search Functionality
- The search icon is located at the top-right of the Products page in the Navigation Bar.
- Click the magnifying glass icon to reveal a text box where you can type your search query.
- Enter keywords (e.g., "motherboards" or "Corsair") to find specific products.

---

### ◯ About Us
Learn who we are, our story, our mission, and why we believe PixelParts is the right choice for your PC needs.

---

### ◯ Blog Page
Check out our blog for helpful guides and insights. Our current featured post is **10 Must-Have PixelParts to Build Your Own PC**.

---

### ◯ Contact Us
Have questions or concerns? Visit our Contact page for more details on how to reach us.

---

### ◯ Login / Account 

*(Note: You must be logged in to purchase items from our website.)*

- **Navigation Bar Indication (Not Logged In)**: If you are not logged in you will see a "Log In" button, which will take you to our login page with the following features:
  - Login: If you already have an account, simply enter your email and password to sign in.
  - Create an Account: If you don’t have an account, click the "Create an Account" button, enter your details, and you’ll be ready to go! Once registered, you can log in using your credentials.
- **Navigation Bar Indication (Logged In)**: If you are logged in you will a "Hello, (Your Name)" button, this functions as a button and upon hovering a dropdown menu appears with linking the following pages:
  - Account Settings: Clicking the "Hello, (Your Name)" directly or selecting the "Account Settings" option from the dropdown brings you to a page with the following features:
    - Account Information: Displays all your current information.
    - Edit Information: Using the dropdown menu selecting a desired field, input the updated information in the text box, and click the "Update Information" button to successfully update your account.
  - Orders: Displaying the order ID, total cost, amount of items, and date of all previous orders. Clicking on the "Order Details" button of any specific order will take you to a detailed order summary page:
    - Order Details: Specific order detail page displays all the items in the order including thier image, name, quantity, and price (price is adjusted based on quantity).

---

### ◯ Cart 
- **Cart**: Clicking on the cart icon located in the top right of every page allows you to view your current cart.
- **Updating Items in your Cart**:
  - Quantity: Using our quantity box you can type a custom desired quantity or using the up/down arrows to increase/decrease quantity by one.
  - Remove Items: Clicking the "Remove" button will completely remove the item (no matter the quantity) from your cart.
- All changes to products in the cart and/or their quantity immediately updates and displays the correct Subtotal, Tax, and Total.
- When you're ready, click the “Proceed to Checkout” button to proceed to the checkout page and finalize your purchase.

---

### ◯ Checkout 
- **Order Summary**: Review your order using our Order Summary displayed on the right side of the checkout page displaying the subtotal, tax, and total of the order aswell as these details for each product in the cart:
  - Product Name
  - Quantity
  - Price (Adjusted based on the quantity)
- **Required Information**: Complete the checkout process by filling in your personal details, shipping address, and payment information in their respective fields.
- Once you have correctly filled in each field click the "Complete Order* button to make the payment and be taken to our order confirmation and shipping page. 

---

### ◯ Confirmation / Shipping Page
- Thank you for your purchase!
- The following information about your order will be displayed:
  - **Order Summary**
    - Product Name
    - Quantity
    - Price (Adjusted by quantity)
  - **Order Information**
    - Order Number
    - Order Date
    - Estimated Delivery Date
  - **Shipping Information**
    - Shipping Method
    - Tracking Number
    - Shipping Address
  - **Payment Details**
    - Payment Information
    - Subtotal
    - Tax
    - Total
- When you are finished reviewing your order you can click the "View Orders" button to be redirected to your order history page or "Continue Shopping" to be redirected to the products page. 

---

### ◯ Chatbot
- We have a chatbot icon located at the bottom-right corner of every page.
- Click the icon to expand a chatbox and being asking questions related to the website.
- **Note**: The chatbot only responds to queries related to our products and services. It will not provide personal information or respond to off-topic questions.

---

### ◯ Admin Panel
- Accessible by the "Admin Panel" button displayed in the Navigation Bar (Only visible to administrator accounts)
- Gives admistrators the following capabilities:
  - Add Products: Add a new product.
  - Get Product: Get the current information of a product.
  - Delete Product: Delete a product based on its product ID.
  - Update Product: Update a specific field of a product.

---
We hope you have a good experience using our site and we can assist you in all your computer related needs.
Thank you for choosing PixelParts!
