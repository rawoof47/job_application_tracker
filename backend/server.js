const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobRoutes');
const db = require('./config/db'); // Import the database configuration

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Use job routes
app.use('/api', jobRoutes);

// Check the database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
