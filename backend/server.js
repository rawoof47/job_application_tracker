const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobRoutes');
const db = require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', jobRoutes);

// ✅ Register new user with role
app.post('/api/register', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }

  if (role !== 'jobseeker' && role !== 'recruiter') {
    return res.status(400).json({ message: 'Role must be either jobseeker or recruiter.' });
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ? AND role = ?';
  db.query(checkQuery, [email, role], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error during check.' });

    if (result.length > 0) {
      return res.status(409).json({ message: 'Email already registered with this role.' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Error hashing password.' });

      const insertQuery = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
      db.query(insertQuery, [email, hashedPassword, role], (err) => {
        if (err) return res.status(500).json({ message: 'Error saving user.' });

        res.status(201).json({ message: 'User registered successfully!' });
      });
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
        { userId: result[0].user_id, email: result[0].email, role: result[0].role },
        'your_jwt_secret', // 🔒 Replace with env variable for production
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        userId: result[0].user_id,
        role: result[0].role
      });
    });
  });
});

// ✅ Apply for a job
app.post('/api/apply-job', (req, res) => {
  const { jobId, userId } = req.body;

  if (!jobId || !userId) {
    return res.status(400).json({ message: 'Job ID and User ID are required.' });
  }

  const query = 'UPDATE jobs SET applicants = applicants + 1 WHERE id = ?';
  db.query(query, [jobId], (err) => {
    if (err) return res.status(500).json({ message: 'Error applying for job.' });

    const insertQuery = 'INSERT INTO job_applications (job_id, user_id) VALUES (?, ?)';
    db.query(insertQuery, [jobId, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Error saving job application.' });

      res.status(200).json({ message: 'Job applied successfully!' });
    });
  });
});

// ✅ Get total applications per job
app.get('/api/jobs-applications', (req, res) => {
  const query = `
    SELECT jobs.id, jobs.company, jobs.role, jobs.salary, jobs.type, jobs.applicants,
           COUNT(job_applications.job_id) AS total_applications
    FROM jobs
    LEFT JOIN job_applications ON jobs.id = job_applications.job_id
    GROUP BY jobs.id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching job applications.' });

    res.status(200).json({ jobs: result });
  });
});

// ✅ Check DB connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to the database');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
