const db = require('../config/db');

// Create a new job
exports.createJob = (req, res) => {
  const { company, role, salary, type } = req.body;

  const sql = 'INSERT INTO jobs (company, role, salary, type) VALUES (?, ?, ?, ?)';
  const values = [company, role, salary, type];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting job:', err);
      res.status(500).json({ error: 'Failed to create job' });
    } else {
      res.status(201).json({ message: 'Job posted successfully', jobId: result.insertId });
    }
  });
};

// Get all jobs
exports.getJobs = (req, res) => {
  const sql = 'SELECT * FROM jobs';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    } else {
      res.json(results);
    }
  });
};

// Update an existing job
exports.updateJob = (req, res) => {
  const { id } = req.params;
  const { company, role, salary, type } = req.body;

  const sql = 'UPDATE jobs SET company = ?, role = ?, salary = ?, type = ? WHERE id = ?';
  db.query(sql, [company, role, salary, type, id], (err) => {
    if (err) {
      console.error('Error updating job:', err);
      res.status(500).json({ error: 'Failed to update job' });
    } else {
      res.json({ message: 'Job updated successfully' });
    }
  });
};

// Delete a job
exports.deleteJob = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM jobs WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error deleting job:', err);
      res.status(500).json({ error: 'Failed to delete job' });
    } else {
      res.json({ message: 'Job deleted successfully' });
    }
  });
};
