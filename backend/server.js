const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobRoutes');
const db = require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Use job routes
app.use('/api', jobRoutes);

// ✅ Register new user
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password.' });
    }

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(query, [email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Email already registered.' });
        }
        return res.status(500).json({ message: 'Error saving user.' });
      }

      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

// ✅ Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (result.length === 0) return res.status(404).json({ message: 'User not found.' });

    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords.' });

      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

      const token = jwt.sign(
        { userId: result[0].user_id, email: result[0].email },
        'your_jwt_secret', // Replace with your actual secret key
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token: token,
        userId: result[0].user_id,
      });
    });
  });
});

// ✅ Job Application
app.post('/api/apply-job', (req, res) => {
  const { jobId, userId } = req.body;

  // Check if the job exists and if the user is logged in
  if (!jobId || !userId) {
    return res.status(400).json({ message: 'Job ID and User ID are required.' });
  }

  // Update job application status and number of applicants
  const query = 'UPDATE jobs SET applicants = applicants + 1 WHERE id = ?';
  db.query(query, [jobId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error applying for job.' });
    }

    // Insert job application into the application table
    const insertQuery = 'INSERT INTO job_applications (job_id, user_id) VALUES (?, ?)';
    db.query(insertQuery, [jobId, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving job application.' });
      }

      res.status(200).json({ message: 'Job applied successfully!' });
    });
  });
});

// ✅ Get number of applications for each job
app.get('/api/jobs-applications', (req, res) => {
  const query = 'SELECT jobs.id, jobs.company, jobs.role, jobs.salary, jobs.type, jobs.applicants, COUNT(job_applications.job_id) AS total_applications FROM jobs LEFT JOIN job_applications ON jobs.id = job_applications.job_id GROUP BY jobs.id';
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching job applications.' });
    }

    res.status(200).json({ jobs: result });
  });
});

// ✅ MySQL connection check
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
