const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Route to create a new job
router.post('/jobs', jobController.createJob);

// Route to get all jobs
router.get('/jobs', jobController.getJobs);

// Route to apply for a job
router.post('/jobs/apply', jobController.applyJob);

// Route to get applied jobs for a specific jobseeker
router.get('/jobs/applied/:email', jobController.getAppliedJobs);

// Route to update a job
router.put('/jobs/:id', jobController.updateJob);

// Route to delete a job
router.delete('/jobs/:id', jobController.deleteJob);

module.exports = router;
