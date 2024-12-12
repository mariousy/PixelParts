import mysql from 'mysql2';
import bcrypt from 'bcryptjs';


// Create a connection to the database
const connection = mysql.createConnection({
  host: 'pixelpartsdatabase.cds6mc4ieyzx.us-east-2.rds.amazonaws.com', // Amazon RDS server endpoint
  user: 'pixelpartsadmin', // MySQL username
  password: 'pixelparts', //  MySQL password
  database: 'pixelparts' // database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});


const defaultUser = {
  iduser: '', // Generated UNIQUE PK ID
  email: '',
  password: '',
  firstname: null,
  lastname: null,
  streetaddress: null,
  city: null,
  state: null,
  zip: null,
  cellphone: null,
};

const defaultProduct = {
  idproduct: '', // Generated UNIQUE PK ID
  manufacturer: '',
  name: '',
  description: '',
  category: '',
  price: '',
  stockquantity: '',
  intendeduse: null,
  image: '',
  image2: '',
  image3: '',
  image4: '',
  image5: '',
};

const defaultOrder = {
  idorder: '', // Generated UNIQUE PK ID
  order_cartid: null, // Foreign key from cart
  firstname: '',
  lastname: '',
  email: '',
  cellphone: '',
  shippingaddress: '',
  shippingcity: '',
  shippingstate: '',
  shippingzip: '',
  // orderdate is omitted as the database will handle this with the defualt DATETIME - no need to ever fill out this field
};

const defaultCart = {
  idcart: '', // Generated UNIQUE PK ID
  cart_userid: '', // Foreign key from cart
};

const defaultCartItem = {
  idcartitem: '', // Generated UNIQUE PK ID
  cartitem_cartid: '', // Foreign key from cart
  cartitem_productid: '', // Foreign key from product
  quantity: '', 
};

const defaultPayment = {
  idpayment: '', // Generated UNIQUE PK ID
  payment_orderid: '', // Foreign key from order
  fullname: '',
  cardnumber: '',
  expirationdate: '',
  securitycode: '',
  total: '',
  // paymentdate is omitted as the database will handle this with the defualt CURRENT_TIMESTAMP - no need to ever fill out this field
};

const defaultReview = {
  idreview: '', // Generated UNIQUE PK ID
  review_productid: '', // Foreign key from product
  fullname: '',
  rating: '',
  reviewinfo: null,
};

// Function to add a review
const addReview = (review) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO review (review_productid, fullname, rating, reviewinfo) VALUES (?, ?, ?, ?)';
    connection.query(query, [review.review_productid, review.fullname, review.rating, review.reviewinfo], (err, results) => {
      if (err) {
        console.error('Error adding review: ', err);
        reject(err);
      } else {
        review.idreview = results.insertId; // store the generated PK ID created by the database
        resolve(review); // return the review object
      }
    });
  });
};
/*
// Test function for adding a review
const testAddReview = async () => {
  const newReview = { 
    ...defaultReview,
    review_productid: '1', 
    rating: 4, 
    reviewinfo: 'This is a great product!',
  }; 
  try {
    const result = await addReview(newReview);
    console.log('Review added successfully:', result);
  } catch (error) {
    console.error('Failed to add review:', error.message); 
  }
};
testAddReview();
*/

// Function to get all the reviews of a specific product
const getReviews = (productId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM review WHERE review_productid = ? ORDER BY idreview DESC';
    connection.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to get the average rating of a specific product (rounding to the nearest whole number)
const getRating = (productId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT ROUND(AVG(rating)) AS rating FROM review WHERE review_productid = ?';
    connection.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Error fetching rating:', err);
        reject(err);
      } else {
        const rating = results[0]?.rating;
        if (rating === null || rating === undefined) {
          resolve('No Rating');
        } else {
          resolve(rating);
        }
      }
    });
  });
};


const addCart = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO cart (cart_userid) VALUES (?)';
    connection.query(query, [user.iduser], (err, results) => {
      if (err) {
        console.error('Error adding cart: ', err);
        reject(err);
      } else {
        const newCart = {
          ...defaultCart,          
          idcart: results.insertId, 
          cart_userid: user.iduser, 
        };
        
        resolve(newCart); // Resolving the new cart object
      }
    });
  });
};
/*
// Test function for adding a cart
const testAddCart = async () => {
  const cart = {
    ...defaultCart,
    cart_userid: 10,
  };
  try {
    const result = await addCart(cart);
    console.log('Cart added successfully:', result);
  } catch (error) {
    console.error('Failed to add cart:', error.message);
  }
};
testAddCart();
*/

const checkActiveCart = (cart) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM orderrecord WHERE order_cartid = ?';
    connection.query(query, [cart.idcart], (err, results) => {
      if (err) {
        console.error('Error checking active cart: ', err);
        return reject(err);
      }
      resolve(results.length === 0); // Return true if there are no results
    });
  });
};


// Function to get the latest cart for a user
const getLatestCartForUser = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM cart WHERE cart_userid = ? ORDER BY idcart DESC LIMIT 1';
    connection.query(query, [user.iduser], (err, results) => {
      if (err) {
        console.error('Error getting latest cart: ', err);
        reject(err);
      } else if (results.length === 0) {
        resolve(null);  // No cart found
      } else {
        const cart = {
          ...defaultCart,
          idcart: results[0].idcart,
          cart_userid: user.iduser, // link it with the user
        };
        resolve(cart);  // Return the full cart object
      }
    });
  });
};

/*
// Test function for getting the latest cart for a user
const testGetLatestCartForUser = async () => {
  const user = {
    ...defaultUser,
    iduser: 5,  // Example user ID
    email: 'testuser@example.com',
  };

  try {
    const result = await getLatestCartForUser(user);  // Call the function with the user object
    console.log('Latest cart retrieved successfully:', result);
  } catch (error) {
    console.error('Failed to retrieve the latest cart:', error.message);
  }
};

// Invoke the test function
testGetLatestCartForUser();
*/



// Function to add an item to a cart
const addCartItem = (cartitem) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO cartitem (cartitem_cartid, cartitem_productid, quantity) VALUES (?, ?, ?)';
    connection.query(query, [cartitem.cartitem_cartid, cartitem.cartitem_productid, cartitem.quantity], (err, results) => {
      if (err) {
        console.error('Error adding item to car: ', err);
        reject(err);
      } else {
        cartitem.idcartitem = results.insertId // store the generated PK ID created by the database
        resolve(cartitem); // return the cartitem object
      }
    });
  });
};
/*
// Test function for adding an item to a cart
const testAddCartItem = async () => {
  const cartItem = {
    ...defaultCartItem,
    cartitem_cartid: 10,
    cartitem_productid: 3,
    quantity: 2,
  };
  try {
    const result = await addCartItem(cartItem);
    console.log('Cart item added successfully:', result);
  } catch (error) {
    console.error('Failed to add cart item:', error.message);
  }
};
testAddCartItem();
*/

// Function to get all items from a cart
const getCartItems = (cart) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM cartitem WHERE cartitem_cartid = ?';
    connection.query(query, [cart.idcart], (err, results) => {
      if (err) {
        console.error('Error getting cart items: ', err);
        reject(err);
      } else if (results.length === 0) {
        resolve([]); // returns an empty array when no items are in the specified cart
      } else {
        const allItems = results.map(item => ({
          ...defaultCartItem,
          ...item,
        }));
        resolve(allItems);
      }
    });
  });
};
/*
// Test function for getting cartitems
const testGetCartItems = async () => {
  const cart = {
    ...defaultCart,
    idcart: '1',
  };
  try {
    const cartItems = await getCartItems(cart);
    console.log('Cart items retrieved successfully:', cartItems);
  } catch (error) {
    console.error('Failed to retrieve cart items:', error.message);
  }
};
testGetCartItems();
*/

// SQL function to check if a product exists in the cart
const checkProductInCart = (cartitem) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM cartitem WHERE cartitem_cartid = ? AND cartitem_productid = ?';
    connection.query(query, [cartitem.cartitem_cartid, cartitem.cartitem_productid], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null); // Return the existing cart item or null
      }
    });
  });
};


// Function to remove an item to a cart
const deleteCartItem = (idcartitem) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM cartitem WHERE idcartitem = ?';
    connection.query(query, [idcartitem], (err, results) => {
      if (err) {
        console.error('Error removing item from cart: ', err);
        reject(err);
      } else if (results.affectedRows === 0) {
        reject(new Error('Cart item not found / No changes made'));
      } else {
        resolve(`Cart item with ID ${idcartitem} deleted successfully.`);
      }
    });
  });
};
/*
// Test function for deleting a cartitem
const testDeleteCartItem = async () => {
  const cartItemToDelete = {
    ...defaultCartItem,
    idcartitem: 2, 
  };
  try {
    const result = await deleteCartItem(cartItemToDelete);
    console.log(result);
  } catch (error) {
    console.error('Failed to delete cart item:', error.message);
  }
};
testDeleteCartItem();
*/

// Function to change the quantity of an item in the cart
const updateCartItemQuantity = (idcartitem, newQuantity) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE cartitem SET quantity = ? WHERE idcartitem = ?';
    connection.query(query, [newQuantity, idcartitem], (err, results) => {
      if (err) {
        console.error('Error updating cart item quantity: ', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

/*
// Test function for updating a cartitems quantity
const testUpdateCartItemQuantity = async () => {
  const cartItemToUpdate = {
    ...defaultCartItem,
    idcartitem: '1', 
    quantity: 3, 
  };
  try {
    const result = await updateCartItemQuantity(cartItemToUpdate);
    console.log(result); 
  } catch (error) {
    console.error('Failed to update cart item quantity:', error.message);
  }
};
testUpdateCartItemQuantity();
*/
 
// Function to add a product
const addProduct = (product) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO product (manufacturer, name, description, category, intendeduse, price, stockquantity, image, image2, image3, image4, image5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [
      product.manufacturer,
      product.name,
      product.description,
      product.category,
      product.intendeduse,
      product.price,
      product.stockquantity,
      product.image,  
      product.image2,
      product.image3, 
      product.image4, 
      product.image5, 
    ], (err, results) => {
      if (err) {
        console.error('Error adding product: ', err);
        reject(err);
      } else {
        product.idproduct = results.insertId; // Store the generated PK ID
        resolve(product); // Return the product object
      }
    });
  });
};

/*
// Test function for adding a product
const testAddProduct = async () => {
  const product = {
    ...defaultProduct,
    manufacturer: 'ThinkVision',
    name: 'ThinkVision 23.8 inch Touch Monitor-T24t-20',
    description: '23.8 inch in-plane switching display, along with 1920 x 1080 FHD resolution. Very flexible ergonomic stand and eye-caring with natural blue light technology. Also has USB Type-C one cable solution.',
    intendeduse: 'Office',
    category: 'Monitor',
    price: 240.00,
    stockquantity: 20,
    image: 'ThinkVision.jpg',
    image2: 'ThinkVision1.jpg',
    image3: 'ThinkVision2.jpg',
    image4: 'ThinkVision3.jpg',
    image5: 'ThinkVision4.jpg',
  };
  try {
    const result = await addProduct(product);
    console.log('Product added successfully:', result);
  } catch (error) {
    console.error('Failed to add product:', error.message);
  }
};
testAddProduct();
*/

// Function to get a full page 11 of products and using offset to get different pages
const getProducts = (page, limit, filter, sort) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    // Default query, if no filter is applied
    let query = 'SELECT * FROM product LIMIT ? OFFSET ?';

    //  query based on the filter
    if (filter === 'Featured Products') {
      query = 'SELECT * FROM product LIMIT ? OFFSET ?';
    } else if (filter === 'Processors') {
      query = 'SELECT * FROM product WHERE category IN ("CPU", "Processor") LIMIT ? OFFSET ?';
    } else if (filter === 'Motherboards') {
      query = 'SELECT * FROM product WHERE category = "Motherboard" LIMIT ? OFFSET ?';
    } else if (filter === 'Graphics Cards') {
      query = 'SELECT * FROM product WHERE category in ("GPU", "Graphics Card", "Video Card") LIMIT ? OFFSET ?';
    } else if (filter === 'Memory') {
      query = 'SELECT * FROM product WHERE category = "RAM" LIMIT ? OFFSET ?';
    } else if (filter === 'Storage') {
      query = 'SELECT * FROM product WHERE category IN ("SSD", "HDD") LIMIT ? OFFSET ?';
    } else if (filter === 'Power Supplies') {
      query = 'SELECT * FROM product WHERE category IN ("Power Supply", "PSU") LIMIT ? OFFSET ?';
    } else if (filter === 'Cooling and Lighting') {
      query = 'SELECT * FROM product WHERE category IN ("Cooler", "Cooling", "Lights", "Light Kit", "Lighting", "Lighting Kit") LIMIT ? OFFSET ?';
    } else if (filter === 'Cases') {
      query = 'SELECT * FROM product WHERE category IN ("Case", "Computer Case") LIMIT ? OFFSET ?';
    } else if (filter === 'Peripherals and Accessories') {
      query = 'SELECT * FROM product WHERE category IN ("Mousepad", "Mouse", "Keyboard", "Chair", "Headset", "Monitor", "Keyboard & Mouse", "Flash Drive", "Cables") LIMIT ? OFFSET ?';
    } 

    // Determine the sorting order
    let sortOrder = ''; 
    if (sort === 'priceAsc') {
      sortOrder = 'ORDER BY price ASC';
    } else if (sort === 'priceDesc') {
      sortOrder = 'ORDER BY price DESC';
    } else if (sort === 'manuAsc') {
      sortOrder = 'ORDER BY manufacturer DESC';
    } else if (sort === 'manuDesc') {
      sortOrder = 'ORDER BY manufacturer ASC';
    }

    // If sorting is specified modify the query
    if (sortOrder) {
      query = query.replace('LIMIT ? OFFSET ?', `${sortOrder} LIMIT ? OFFSET ?`);
    }
    connection.query(query, [limit, offset], (err, results) => { 
      if (err) {
        console.error('Error getting products: ', err);
        reject(err);
      } else if (results.length === 0) {
        reject(new Error('No products found'));
      } else {
        resolve(results);
      }
    });
  });
};

/*
// Test function for getting all products
const testGetProducts = async () => {
  try {
    const products = await getProducts();
    console.log('Current Products:', products);
  } catch (error) {
    console.error('Failed to get products:', error.message);
  }
};
testGetProducts();
*/

const getTotalProducts = (filter) => {
  return new Promise((resolve, reject) => {
    let query;

    if (filter === 'Featured Products') {
      query = 'SELECT COUNT(*) AS total FROM product';  // Featured Products is default
    } else if (filter === 'Processors') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category IN ("CPU", "Processor")';
    } else if (filter === 'Motherboards') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category = "Motherboard"';
    } else if (filter === 'Graphics Cards') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category IN ("GPU", "Graphics Card", "Video Card")';
    } else if (filter === 'Memory') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category = "RAM"';
    } else if (filter === 'Storage') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category IN ("SSD", "HDD")';
    } else if (filter === 'Power Supplies') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category IN ("Power Supply", "PSU")';
    } else if (filter === 'Cooling and Lighting') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category IN ("Cooler", "Cooling", "Lights", "Light Kit", "Lighting", "Lighting Kit")';
    } else if (filter === 'Cases') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category IN ("Case", "Computer Case")';
    } else if (filter === 'Peripherals and Accessories') {
      query = 'SELECT COUNT(*) AS total FROM product WHERE category IN ("Mousepad", "Mouse", "Keyboard", "Chair", "Headset", "Monitor", "Keyboard & Mouse", "Flash Drive", "Cables")';
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error getting total products count: ', err);
        reject(err);
      } else {
        resolve(results[0].total);  // Resolve with the total count
      }
    });
  });
};

// Function to get the total amount of products for the given search term
const getTotalSearchCount = (searchTerm) => {
  return new Promise((resolve, reject) => {
    const likeTerm = `%${searchTerm}%`;
    const query = 'SELECT COUNT(*) AS total FROM product WHERE manufacturer LIKE ? OR name LIKE ? OR description LIKE ? OR category LIKE ?';
    connection.query(query, [likeTerm, likeTerm, likeTerm, likeTerm], (err, results) => {
      if (err) {
        console.error('Error getting total search count: ', err);
        reject(err);
      } else {
        resolve(results[0].total);  // Resolve with the total count
      }
    });
  });
};


// Function to get a product by product ID
const getProductById = (product) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM product WHERE idproduct = ?';
    connection.query(query, [product.idproduct], (err, results) => {
      if (err) {
        console.error('Error getting product with desired ID: ', err);
        reject(err);
      } else if (results.length === 0) {
        reject(new Error('No product found with this ID'));
      } else {
        Object.assign(product, results[0]);
        resolve(product); // return product found by ID
      }
    });
  });
};
/*
// Test function for getting product by ID
const testGetProductById = async () => {
  const product = { 
    ...defaultProduct,
    productId: 1,
  };
  try {
    const retrievedProduct = await getProductById(product);
    console.log('Product retrieved successfully:', retrievedProduct);
  } catch (error) {
    console.error('Failed to retrieve product:', error.message);
  }
};
testGetProductById();
*/

// Function to get the correct products for the given searchterm/page/sort
const getProductSearch = (searchTerm, page, limit, sort) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const likeTerm = `%${searchTerm}%`;

    let query = 'SELECT * FROM product WHERE manufacturer LIKE ? OR name LIKE ? OR description LIKE ? OR category LIKE ? LIMIT ? OFFSET ?';

    // check if a sorting filter is applied
    let sortOrder = '';
    if (sort === 'priceAsc') {
      sortOrder = 'ORDER BY price ASC';
    } else if (sort === 'priceDesc') {
      sortOrder = 'ORDER BY price DESC';
    } else if (sort === 'manuAsc') {
      sortOrder = 'ORDER BY manufacturer DESC';
    } else if (sort === 'manuDesc') {
      sortOrder = 'ORDER BY manufacturer ASC';
    }

    // if a sorting filter is applied add it to the query
    if (sortOrder) {
      query = query.replace('LIMIT ? OFFSET ?', `${sortOrder} LIMIT ? OFFSET ?`);
    }

    connection.query(query, [likeTerm, likeTerm, likeTerm, likeTerm, limit, offset], (err, results) => {
      if (err) {
        console.error('Error searching for products: ', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to update a specific attribute of a product
const updateProduct = (product, field) => {
  return new Promise((resolve, reject) => {
    // Check if the field exists on the user object
    const update = product[field];
    
    if (update === undefined) {
      return reject(new Error(`Field '${field}' does not exist on product object`));
    }
    const query = `UPDATE product SET ${field} = ? WHERE idproduct = ?`;
    connection.query(query, [product[field], product.idproduct], (err, results) => {
      if (err) {
        console.error('Error updating product: ', err);
        reject(err);
      } else if (results.affectedRows === 0) {
        reject(new Error('Product not found / No changes were applied'));
      } else {
        resolve('Product ID ' + product.idproduct + ' updated field ' + field + ' to ' + product[field]);
      }
    });
  });
};
/*
// Test function for updating a product
const testUpdateProduct = async () => {
  const product = { 
    ...defaultProduct, 
    idproduct: 17, 
    name: 'Logitech M310 Wireless Optical Mouse, Black',
    stockquantity: 200,
    image: 'GIGABYTERadeonRX7800XT.jpg'
  };
  try {
    const message = await updateProduct(product, 'name'); // second parameter is the name of field you wish to change
    console.log(message);
  } catch (error) {
    console.error('Failed to update product field:', error.message);
  }
};
testUpdateProduct();
*/


// Function to delete a product
const deleteProduct = (product) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM product WHERE idproduct = ?';
    connection.query(query, [product.idproduct], (err, results) => {
      if (err) {
        console.error('Error deleting product: ', err);
        reject(err);
      } else if (results.affectedRows === 0) {
        reject(new Error('Product not found / No changes were applied'));
      } else {
        resolve('Product ID ' + product.idproduct + ' deleted');
      }
    });
  });
};
/*
// Test function for deleting a product
const testDeleteProduct = async () => {
  const productToDelete = { ...defaultProduct, idproduct: 43 };
  try {
    const message = await deleteProduct(productToDelete);
    console.log(message);
  } catch (error) {
    console.error('Failed to delete product:', error.message);
  }
};
testDeleteProduct();
*/

// Function to add a payment
const addPayment = (payment) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO payment (payment_orderid, fullname, cardnumber, expirationdate, securitycode, total) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [payment.payment_orderid, payment.fullname, payment.cardnumber, payment.expirationdate, payment.securitycode, payment.total], (err, results) => {
      if (err) {
        console.error('Error adding payment: ', err);
        reject(err);
      } else {
        payment.idpayment = results.insertId // store the generated PK ID created by the database
        resolve(payment); // return the payment object
      }
    });
  });
};
/*
// Test function for add payment
const testAddPayment = async () => {
  const payment = {
    ...defaultPayment,
    payment_orderid: 3,
    provider: 'Visa',
    fullname: 'John Doe',
    cardnumber: '1111111111111111',
    expirationdate: '12/25',
    securitycode: '123',
    total: 25.25
  };
  try {
    const result = await addPayment(payment);
    console.log('Payment added successfully. Payment ID:', result);
  } catch (error) {
    console.error('Failed to add payment:', error.message);
  }
};
testAddPayment();
*/

// Function to get the last four numbers of the card used in a payment for a given order
const getCardLastFour = async (order) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT RIGHT(payment.cardnumber, 4) AS last4digits FROM payment WHERE payment_orderid = ?';
    connection.query(query, [order.idorder], (err, results) => {
      if (err) {
        console.error('Error getting payment record: ', err);
        reject(err);
      } else if (results.length > 0) {
        const last4digits = results[0].last4digits;
        resolve(last4digits); // Return the last 4 digits
      } else {
        reject(new Error('No payment record found for this order ID'));
      }
    });
  });
};

// Function to get the total price of a given order based on ID
const getTotalPrice = async (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT p.total FROM payment p WHERE p.payment_orderid = ?`;
    connection.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error getting payment total:', err);
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(results[0].total);
        } else {
          reject(new Error('No payment record found for this order.'));
        }
      }
    });
  });
};

// Function to add a new order
const addOrder = (order) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO orderrecord (order_cartid, firstname, lastname, email, cellphone, shippingaddress, shippingcity, shippingstate, shippingzip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [order.order_cartid, order.firstname, order.lastname, order.email, order.cellphone, order.shippingaddress, order.shippingcity, order.shippingstate, order.shippingzip], (err, results) => {
      if (err) {
        console.error('Error adding order: ', err);
        reject(err);
      } else {
        order.idorder = results.insertId // store the generated PK ID created by the database
        resolve(order); // return the order object
      }
    });
  });
};
/*
// Test function for add order
const testAddOrder = async () => {
  const order = {
    ...defaultOrder,
    order_cartid: 1,
    firstname: 'Mike',
    lastname: 'Johnson',
    email: 'mikejohnson@gmail.com',
    cellphone: '555-777-6666',
    shippingaddress: '123 Maple St',
    shippingcity: 'Springfield',
    shippingstate: 'IL',
    shippingzip: '62701',
  };
  try {
    const result = await addOrder(order);
    console.log('Order added successfully:', result);
  } catch (error) {
    console.error('Failed to add order:', error);
  }
};
testAddOrder();
*/

// Function to get order information for a given cart
const getOrder = async (cart) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM orderrecord WHERE order_cartid = ?';
    connection.query(query, [cart.idcart], (err, results) => {
      if (err) {
        console.error('Error getting order record: ', err);
        reject(err);
      } else if (results.length > 0) {
        const order = { ...defaultOrder };
        // map the result to order
        const dbOrder = results[0];
        order.idorder = dbOrder.idorder || ''; 
        order.order_cartid = dbOrder.order_cartid || null; 
        order.firstname = dbOrder.firstname || ''; 
        order.lastname = dbOrder.lastname || ''; 
        order.email = dbOrder.email || ''; 
        order.cellphone = dbOrder.cellphone || ''; 
        order.shippingaddress = dbOrder.shippingaddress || ''; 
        order.shippingcity = dbOrder.shippingcity || ''; 
        order.shippingstate = dbOrder.shippingstate || ''; 
        order.shippingzip = dbOrder.shippingzip || '';
        resolve(order); // Return the populated order object
      } else {
        reject(new Error('No order record found under this cart ID'));
      }
    });
  });
};

// Function to get all the orders for a given user
const getAllOrders = async (user) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        o.idorder,
        o.order_cartid,
        o.firstname,
        o.lastname,
        o.email,
        o.cellphone,
        o.shippingaddress,
        o.shippingcity,
        o.shippingstate,
        o.shippingzip,
        o.orderdate,
        COUNT(ci.cartitem_productid) AS total_items,
        p.total AS total_cost
    FROM orderrecord o
    JOIN cart c ON o.order_cartid = c.idcart
    LEFT JOIN cartitem ci ON c.idcart = ci.cartitem_cartid
    LEFT JOIN payment p ON o.idorder = p.payment_orderid
    WHERE c.cart_userid = ?
    GROUP BY o.idorder
    `;
    connection.query(query, [user.iduser], (err, results) => {
      if (err) {
        console.error('Error getting orders: ', err);
        reject(err);
      } else if (results.length >= 0) {
        const orders = results.map(dbOrder => {
          const order = { ...defaultOrder };
          // map result to order
          order.idorder = dbOrder.idorder || ''; 
          order.order_cartid = dbOrder.order_cartid || null;
          order.firstname = dbOrder.firstname || '';
          order.lastname = dbOrder.lastname || '';
          order.email = dbOrder.email || '';
          order.cellphone = dbOrder.cellphone || '';
          order.shippingaddress = dbOrder.shippingaddress || '';
          order.shippingcity = dbOrder.shippingcity || '';
          order.shippingstate = dbOrder.shippingstate || '';
          order.shippingzip = dbOrder.shippingzip || '';
          order.orderdate = dbOrder.orderdate || '';
          order.totalItems = dbOrder.total_items || 0;
          order.total = dbOrder.total_cost || 0;
          return order;
        });
        resolve(orders); // Return the populated orders
      } else {
        reject(new Error('No orders found for this user'));
      }
    });
  });
};

// Function to delete an order
const deleteOrder = (order) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM orderrecord WHERE idorder = ?';
    connection.query(query, [order.idorder], (err, results) => {
      if (err) {
        console.error('Error deleting order: ', err);
        reject(err);
      } else if (results.affectedRows === 0) {
        reject(new Error('Order not found / Order already deleted'));
      } else {
        resolve('Order deleted with ID ' + order.idorder + '.');
      }
    });
  });
};
/*
// Test function for deleting an order
const testDeleteOrder = async () => {
  const order = {
    ...defaultOrder, 
    idorder: 5, 
  };
  try {
    const result = await deleteOrder(order);
    console.log('Order deletion successful:', result);
  } catch (error) {
    console.error('Failed to delete order:', error.message);
  }
};
testDeleteOrder();
*/

// Function to add a new user
const addUser = (user) => {
  return new Promise((resolve, reject) => {
    // Hash the password before storing it
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {

      if (err) {
        return reject(new Error('Error hashing password.'));
      }
      const query = 'INSERT INTO user (email, password, firstname, lastname, streetaddress, city, state, zip, cellphone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      connection.query(query, [user.email, hashedPassword, user.firstname, user.lastname, user.streetaddress, user.city, user.state, user.zip, user.cellphone], (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return reject(new Error('Email is already in use.'));
          }
          console.error('Error adding user: ', err);
          return reject(err);
        }
        user.iduser = results.insertId;
        resolve(user);
      });
    });
  });
};
/*
// Test function for add user
const testAddUser = async () => {
  const user = {
    ...defaultUser,
    email: 'charliegreen@example.com',
    password: 'charliepassword',
    firstname: 'Charlie',
    lastname: 'Green',
    streetaddress: '852 Maple St',
    city: 'Smallville',
    state: 'KS',
    zip: '66502',
    cellphone: '555-666-5432',
  };
  try {
    const result = await addUser(user);
    console.log('User added successfully:', result);
  } catch (error) {
    console.error('Failed to add user:', error.message);
  }
};
testAddUser();
*/

// Function to get a user by ID
const getUserById = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE iduser = ?';
    connection.query(query, [user.iduser], (err, results) => {
      if (err) {
        console.error('Error getting user: ', err);
        reject(err);
      } else if (results.length > 0) {
        Object.assign(user, results[0]);
        resolve(user);
      } else {
        reject(new Error('No user found under this ID'))
      }
    });
  });
};
/*
// Test function for getting user by ID
const testGetUserById = async () => {
  const user = {
    ...defaultUser,
    iduser: 40,
  };
  try {
    const result = await getUserById(user);
    console.log('User retrieved successfully:', result);
  } catch (error) {
    console.error('Failed to get user by ID:', error.message);
  }
};
testGetUserById();
*/

// Functoin to get a user by email
const getUserByEmail = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    connection.query(query, [user.email], (err, results) => {
      if (err) {
        console.error('Error getting user by email: ', err);
        reject(err);
      } else if (results.length > 0) {
        resolve(results[0]);
      } else {
        reject(new Error('No user found under this email'));
      }
    });
  });
};
/*
// Test function for getting user by email
const testGetUserByEmail = async () => {
  const user = {
    ...defaultUser,
    email: 'test@example.com',
  };
  try {
    const result = await getUserByEmail(user);
    console.log('User retrieved successfully:', result);
  } catch (error) {
    console.error('Failed to get user by email:', error.message);
  }
};
testGetUserByEmail();
*/


// function for user authentication
const userAuthentication = (user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    connection.query(query, [user.email], (err, results) => {
      if (err) {
        console.error('Error querying the database: ', err);
        return reject(err);
      }

      if (results.length === 0) {
        return reject(new Error('Invalid email or password'));
      }
      const storedUser = results[0]; 
      bcrypt.compare(user.password, storedUser.password, (err, isMatch) => { // Compare the entered password with the stored hashed password
        if (err) {
          console.error('Error comparing passwords: ', err);
          return reject(new Error('Password comparison failed'));
        }
        if (isMatch) {
          Object.assign(user, storedUser);
          resolve(user);
        } else {
          return reject(new Error('Invalid email or password'));
        }
      });
    });
  });
};
/*
// Test function for user authentication
const testUserAuthentication = async () => {
  const user = {
    ...defaultUser,
    email: 'duplicate@example.com', 
    password: 'securepassword'
  };
  try {
    const authenticatedUser = await userAuthentication(user);
    console.log('User authenticated successfully:', authenticatedUser);
  } catch (error) {
    console.error('Authentication failed:', error.message);
  }
};
testUserAuthentication();
*/

const updateUser = (user, field) => {
  return new Promise(async (resolve, reject) => {
    let updateValue = user[field];

    // Check if the field being updated is password
    if (field === 'password') {
      try {
        // If the field is password hash the new password
        const hashedPassword = await bcrypt.hash(updateValue, 10);
        updateValue = hashedPassword;
        // Proceed to update the database with the hashed password
        const query = `UPDATE user SET ${field} = ? WHERE iduser = ?`;
        connection.query(query, [updateValue, user.iduser], (err, results) => {
          if (err) {
            console.error('Error updating user: ', err);
            reject(err);
          } else if (results.affectedRows === 0) {
            reject(new Error('User not found / No changes were applied'));
          } else {
            resolve(`User ID ${user.iduser} updated field '${field}'`);
          }
        });
      } catch (err) {
        reject(new Error('Error hashing password'));
      }
    } else {
      const query = `UPDATE user SET ${field} = ? WHERE iduser = ?`;
      connection.query(query, [updateValue, user.iduser], (err, results) => {
        if (err) {
          console.error('Error updating user: ', err);
          reject(err);
        } else if (results.affectedRows === 0) {
          reject(new Error('User not found / No changes were applied'));
        } else {
          resolve(`User ID ${user.iduser} updated field '${field}'`);
        }
      });
    }
  });
};
/*
// Test function for updating user information
const testUpdateUser = async () => {
  const user = {
    ...defaultUser,
    iduser: 10, 
    firstname: 'changed name',
    email: 'changedemail@example.com', 
    password: 'changedpassword',
    streetaddress: '852 Maple St',
  };
  try {
    const result = await updateUser(user, 'streetaddress'); // change second parameter to what you want to change
    console.log('User updated successfully:', result);
  } catch (error) {
    console.error('Failed to update user:', error.message);
  }
};
testUpdateUser();
*/

// Export the functions for use in other parts of your application
export {

  // User related functions
  addUser, // creates a new user
  getUserById, // gets user based on user ID
  getUserByEmail, // gets user based on email
  userAuthentication, // verifys the email and password inputted belongs to a user
  updateUser, // updates a specific field of the users information - first parameter is the user object - second parameter is the field you wish to change

  // Cart related functions
  addCart, // creates a new cart
  getLatestCartForUser,
  checkActiveCart,

  // Order related functions
  addOrder, // creates a new order
  getOrder,
  getAllOrders,
  deleteOrder, // delete an order based on orderID

  // CartItem related functions
  addCartItem, // adds an item to the cart
  getCartItems, // returns all items in the cart
  deleteCartItem, // deletes an item from the cart based on the cartitemID
  updateCartItemQuantity, // updates the quantity of an item in the cart - pass the updated cartitem with the changed quantity 

  // Payment related functions
  addPayment, // creates a new payment
  getCardLastFour,
  getTotalPrice,

  // Product related Functions
  addProduct, // creates a new product
  getProducts, // returns an array of all products in the database
  getProductById, // gets a product based on ID
  updateProduct, // updates a specific field of the product information - first parameter is the product object - second parameter is the field you wish to change
  deleteProduct, // deletes a product
  getProductSearch,
  checkProductInCart,
  getTotalProducts,
  getTotalSearchCount,

  // Review related functions
  addReview, // creates a new review
  getReviews,
  getRating,
};