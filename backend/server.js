const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobRoutes');
const db = require('./config/db'); // Import the database configuration
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for token generation

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Use job routes
app.use('/api', jobRoutes);

// Register new user
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  // Hash password before saving
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Insert user into the database
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(query, [email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving user' });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

// Login existing user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: result[0].user_id, email: result[0].email },
        'your_jwt_secret', // Secret key for signing the token
        { expiresIn: '1h' } // Token expiration time
      );

      res.status(200).json({
        message: 'Login successful',
        token: token, // Send the token to the client
        userId: result[0].user_id,
      });
    });
  });
});

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
