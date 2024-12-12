import express from 'express';
import cors from 'cors';
import {
  addUser,
  getUserById,
  getUserByEmail,
  userAuthentication,
  updateUser,
  addOrder,
  deleteOrder,
  getOrder,
  getAllOrders,
  addCart,
  getLatestCartForUser,
  checkActiveCart,
  checkProductInCart,
  addCartItem,
  getCartItems,
  deleteCartItem,
  updateCartItemQuantity,
  addPayment,
  getCardLastFour,
  addProduct,
  getProducts,
  getTotalProducts,
  getTotalSearchCount,
  getProductSearch,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  getRating,
  getTotalPrice
} from './sql.js';

const app = express();
app.use(cors());
app.use(express.json());

// imports for the image file uploading
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';


// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/assets';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using uuidv4
    const uniqueName = `${uuidv4()}_${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName); // Save the file with the unique name
  }
});

const upload = multer({ storage: storage });

// API endpoint to add products
app.post('/api/products', upload.fields([{ name: 'image' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }, { name: 'image5' }]), async (req, res) => {
  const { manufacturer, name, description, category, intendeduse, price, stockquantity } = req.body;
  const imageFiles = {};
  if (req.files.image) imageFiles.image = req.files.image[0].filename;
  if (req.files.image2) imageFiles.image2 = req.files.image2[0].filename;
  if (req.files.image3) imageFiles.image3 = req.files.image3[0].filename;
  if (req.files.image4) imageFiles.image4 = req.files.image4[0].filename;
  if (req.files.image5) imageFiles.image5 = req.files.image5[0].filename;
  try {
    const newProduct = await addProduct({
      manufacturer,
      name,
      description,
      category,
      intendeduse,
      price,
      stockquantity,
      image: imageFiles.image || null,
      image2: imageFiles.image2 || null,
      image3: imageFiles.image3 || null,
      image4: imageFiles.image4 || null,
      image5: imageFiles.image5 || null,
    });
    res.json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
});

// API endpoint to update s specific field of a product 
app.put('/api/products/:id', async (req, res) => {
  const { field, value } = req.body;  
  const productId = req.params.id;
  if (!field || !value) {
    return res.status(400).send('Field and value are required.');
  }
  try {
    const message = await updateProduct({ idproduct: productId, [field]: value }, field);
    res.json({ message });
  } catch (err) {
    res.status(500).send('Error updating product: ' + err.message);
  }
});

// API endpoint to get products
app.get('/api/products', async (req, res) => {

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 11; // Default to 11 products per page
  const filter = req.query.filter || '';
  const sort = req.query.sort || '';
  const searchTerm = req.query.searchTerm || ''; 

  try {
    let products;
    if (searchTerm != '') { 
      products = await getProductSearch(searchTerm, page, limit, sort); // gets products based on search
    } else { 
      products = await getProducts(page, limit, filter, sort); // gets normal products
    }
    res.json(products);
  } catch (err) {
    console.error('Error retreiving products: ', err);
    res.status(500).send('Error retrieving products');
  }
});

// API endpoint to get total number of items in the database
app.get('/api/products/count', async (req, res) => {
  const { filter, searchTerm } = req.query;  // get the filter and search term
  
  try {
    let totalProducts;
    if (searchTerm) {
      totalProducts = await getTotalSearchCount(searchTerm); // Get product count of specific search term
    } else {
      totalProducts = await getTotalProducts(filter);  // Get normal product count
    }
    res.json(totalProducts);
  } catch (err) {
    console.error('Error retrieving total products count:', err);
    res.status(500).send('Error retrieving total products count');
  }
});


// API endpoint to get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUserById({ iduser: req.params.id });
    res.json(user);
  } catch (err) {
    res.status(500).send('Error retrieving user');
  }
});

// API endpoint to get user by email
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const user = await getUserByEmail({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).send('Error retrieving user by email');
  }
});

// API endpoint to create a new user (signup)
app.post('/api/createUser', async (req, res) => {
  const user = req.body;
  try {
    const newUser = await addUser(user); 
    res.json(newUser);
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// API endpoint to authenticate user (login)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userAuthentication({ email, password });
    if (user) {
      res.json(user);
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// API endpoint to create a new order
app.post('/api/orders', async (req, res) => {
  const { order_cartid, firstname, lastname, email, cellphone, shippingaddress, shippingcity, shippingstate, shippingzip } = req.body;
  try {
    const newOrder = await addOrder({
      order_cartid,
      firstname,
      lastname,
      email,
      cellphone,
      shippingaddress,
      shippingcity,
      shippingstate,
      shippingzip,
    });
    res.json(newOrder);
  } catch (err) {
    res.status(500).send('Error creating order');
  }
});

// API endpoint to delete an order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const message = await deleteOrder({ idorder: req.params.id });
    res.json({ message });
  } catch (err) {
    res.status(500).send('Error deleting order');
  }
});

// API endpoint to get order details by cartId
app.get('/api/user/orders/:id', async (req, res) => {
  const cartId = req.params.id;
  try {
    const order = await getOrder({ idcart: cartId });
    res.json(order);  
  } catch (err) {
    console.error('Error retrieving order details:', err);
    res.status(500).send('Error retrieving order details');
  }
});


// API endpoint to get all orders for a given user by userId
app.get('/api/user/orders/all/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = { iduser: userId }; // create an object with the given ID
    const orders = await getAllOrders(user); 
    res.json(orders); 
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).send('Error retrieving orders');
  }
});



// API endpoint to update a user
app.put('/api/user/:id', async (req, res) => {
  const { user, field } = req.body;
  try {
    const result = await updateUser(user, field);
    res.json({ message: 'User updated successfully', result });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Error updating user');
  }
});

/*
// API endpoint to add a product
app.post('/api/products', async (req, res) => {
  const { name, description, category, price, stockquantity, intendeduse, image } = req.body;
  try {
    const newProduct = await addProduct({
      name,
      description,
      category,
      price,
      stockquantity,
      intendeduse,
      image,
    });
    res.json(newProduct);
  } catch (err) {
    res.status(500).send('Error adding product');
  }
});
*/
// API endpoint to delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const message = await deleteProduct({ idproduct: req.params.id });
    res.json({ message });
  } catch (err) {
    res.status(500).send('Error deleting product');
  }
});

// API endpoint to get a product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await getProductById({ idproduct: req.params.id });
    res.json(product);
  } catch (err) {
    res.status(500).send('Error retrieving product');
  }
});

// API endpoint to get the latest cart connected to the users ID
app.post('/api/cart/latest', async (req, res) => {
  const user = req.body.user;  // Gets the user object passed as a parameter
  try {
    const latestCart = await getLatestCartForUser(user); // Sends user object as parameter
    if (latestCart) { // checks that there is a cart tied to the user
      res.json(latestCart);  // Respond with the populated cart object
    } else {
      res.status(404).send('No cart found for this user');
    }
  } catch (err) {
    res.status(500).send('Error retrieving latest cart');
  }
});

// API endpoing to check if the user has an active cart - if no it creates a new cart
app.post('/api/cart/check', async (req, res) => {
  const cart = req.body.cart; // gets cart object passed as a parameter
  try {
    const isActiveCart = await checkActiveCart(cart);
    if (isActiveCart) {
      res.json(isActiveCart);
    } else {
      res.status(404).send('No active cart for this user');
    }
  } catch (err) {
    res.status(500).send('Error checking active cart');
  }
});

app.post('/api/cart/create', async (req, res) => {
  const user = req.body.user; // gets user object passed as a parameter
  try {
    const newCart = await addCart(user);
    if (newCart) {
      res.json(newCart);
    } else {
      res.status(404).send('Cannot create new cart');
    }
  } catch (err) {
    res.status(500).send('Error creating new cart');
  }
});



// API to add an item to the cart
app.post('/api/cart/add', async (req, res) => {
  const { cartitem } = req.body;  // Get cartitem object from the request body

  if (!cartitem || !cartitem.cartitem_cartid || !cartitem.cartitem_productid || cartitem.quantity <= 0) {
    return res.status(400).json({ error: 'Missing or invalid cartitem parameters' });
  }

  try {
    // Check if the product is already in the cart
    const existingItem = await checkProductInCart(cartitem);

    if (existingItem) {
      // Product exists, update the quantity
      const newQuantity = existingItem.quantity + cartitem.quantity;
      const updateResult = await updateCartItemQuantity(existingItem.idcartitem, newQuantity);
      
      if (updateResult) {
        return res.json({ success: true, message: 'Product quantity updated in cart' });
      } else {
        return res.status(500).json({ error: 'Failed to update cart item' });
      }
    } else {
      // Product doesn't exist, add it to the cart
      const result = await addCartItem(cartitem);
      if (result) {
        return res.json({ success: true, message: 'Product added to cart successfully!' });
      } else {
        return res.status(500).json({ error: 'Failed to add product to cart' });
      }
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint to get all the items from a cart
app.post('/api/cart', async (req, res) => {
  const cart = req.body;  // Gets the cart object passed as a parameter
  try {
    const cartItems = await getCartItems(cart);  

    if (!cartItems || cartItems.length === 0) {
      // If no items found in the cart, return an empty array
      return res.status(200).json([]); 
    }

    res.status(200).json(cartItems);  // Return cart items if available
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart items' });
  }
});



// DELETE route to remove a cart item
app.delete('/api/cart/remove/:idcartitem', async (req, res) => {
  const { idcartitem } = req.params;

  try {
    const result = await deleteCartItem(idcartitem);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

app.post('/api/cart/update', async (req, res) => {
  const { idcartitem, newQuantity } = req.body;

  if (!idcartitem || !newQuantity) {
    return res.status(400).json({ error: 'Missing cart item or quantity' });
  }

  try {
    const result = await updateCartItemQuantity(idcartitem, newQuantity);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ success: true, message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});


// API endpoint to add a payment
app.post('/api/payment', async (req, res) => {
  const { payment_orderid, fullname, cardnumber, expirationdate, securitycode, total} = req.body;
  try {
    const newPayment = await addPayment({
      payment_orderid,
      fullname,
      cardnumber,
      expirationdate,
      securitycode,
      total,
    });
    res.json(newPayment);
  } catch (err) {
    res.status(500).send('Error processing payment');
  }
});

// API endpoint to get the last four digits of the card number for a given order id
app.get('/api/user/orders/payment/:id', async (req, res) => {
  const orderid = req.params.id;
  try {
    const lastFourDigits = await getCardLastFour({ idorder: orderid });
    res.json({ lastFourDigits });
  } catch (err) {
    console.error('Error retrieving payment details:', err);
    res.status(500).send('Error retrieving payment details');
  }
});

// API endpoint to get the total price of an order based on the ID
app.get('/api/order/payment/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    const total = await getTotalPrice(orderId);
    res.json({ total });
  } catch (err) {
    console.error('Error retrieving payment:', err);
    res.status(500).send('Error retrieving payment');
  }
});

// API endpoint to add a review
app.post('/api/reviews', async (req, res) => {
  const { review_productid, fullname, rating, reviewinfo } = req.body;  // Include fullname
  try {
    const newReview = await addReview({
      review_productid,
      fullname, 
      rating,
      reviewinfo,
    });
    res.json(newReview);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).send('Error adding review');
  }
});

// API endpoint to get all the reviews of a specific product
app.get('/api/products/reviews/:id', async (req, res) => {
  try {
    const reviews = await getReviews(req.params.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});


// API endpoint to get the average rating of a specific product
app.get('/api/products/rating/:id', async (req, res) => {
  try {
    const rating = await getRating(req.params.id); 
    res.json(rating); 
  } catch (error) {
    res.status(500).json({ error: 'Error fetching average rating' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
