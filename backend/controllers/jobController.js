const db = require('../config/db');

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
