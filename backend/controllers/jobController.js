const db = require('../config/db');

// Create a new job
exports.createJob = (req, res) => {
  const { company, role, salary, type } = req.body;

  // Basic validation
  if (!company || !role || !salary || !type) {
    return res.status(400).json({ message: 'All fields (company, role, salary, type) are required.' });
  }

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

// Apply for a job
exports.applyJob = (req, res) => {
  const { jobId, email } = req.body; // Get jobId and email from the request body
  const applied_date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

  // Basic validation
  if (!jobId || !email) {
    return res.status(400).json({ message: 'Job ID and Email are required.' });
  }

  // Check if the job exists in the database
  const jobQuery = 'SELECT * FROM jobs WHERE id = ?';
  db.query(jobQuery, [jobId], (err, result) => {
    if (err) {
      console.error('Error checking job existence:', err);
      return res.status(500).json({ message: 'Error checking job existence.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Check if the user has already applied for this job
    const checkQuery = 'SELECT * FROM job_applications WHERE job_id = ? AND email = ?';
    db.query(checkQuery, [jobId, email], (err, existing) => {
      if (err) {
        console.error('Error checking for existing application:', err);
        return res.status(500).json({ message: 'Error checking application status.' });
      }

      if (existing.length > 0) {
        return res.status(409).json({ message: 'Already applied for this job.' });
      }

      // Insert the job application
      const insertQuery = 'INSERT INTO job_applications (job_id, email, applied_date, status) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [jobId, email, applied_date, 'Applied'], (err) => {
        if (err) {
          console.error('Error applying for the job:', err);
          return res.status(500).json({ message: 'Error applying for the job', error: err });
        }

        res.status(200).json({ message: 'Job application successful' });
      });
    });
  });
};

// Get jobs applied by a specific jobseeker
exports.getAppliedJobs = (req, res) => {
  const { email } = req.params;

  const sql = `
    SELECT jobs.id, jobs.company, jobs.role, jobs.salary, jobs.type, job_applications.status, job_applications.applied_date
    FROM jobs 
    JOIN job_applications ON jobs.id = job_applications.job_id 
    WHERE job_applications.email = ?`;

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching applied jobs:', err);
      res.status(500).json({ message: 'Error fetching applied jobs', error: err });
    } else {
      res.status(200).json({ appliedJobs: results });
    }
  });
};

// Update an existing job
exports.updateJob = (req, res) => {
  const { id } = req.params;
  const { company, role, salary, type } = req.body;

  // Basic validation
  if (!company || !role || !salary || !type) {
    return res.status(400).json({ message: 'All fields (company, role, salary, type) are required.' });
  }

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
