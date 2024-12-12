const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

// Serve the static assets from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use('/api', require('./api'));

// Catch-all route to serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});