import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job.model'; // Updated Job model

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoggedIn: boolean = false;
  userEmail: string | null = null;
  loading: boolean = false;
  appliedJobs: Set<number> = new Set(); // Track applied jobs by jobId
  searchQuery: string = ''; // Search query variable
  selectedJobType: string = ''; // 'Full-Time' or 'Part-Time'

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.fetchJobs();
    this.fetchAppliedJobs(); // Fetch applied jobs on login
  }

  // Method to check login status
  checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.userEmail = localStorage.getItem('userEmail');
      console.log('Logged in as:', this.userEmail); // Log the logged-in email for debugging
    }
  }

  // Fetch jobs from the API
  fetchJobs(): void {
    this.loading = true;
    this.http.get<Job[]>('http://localhost:3000/api/jobs').subscribe(
      (data) => {
        // Add applied flag to jobs to track the application status on the frontend
        this.jobs = data.map(job => ({
          ...job,
          applied: job.status === 'Applied' // Check if the status is 'Applied'
        }));
        this.filteredJobs = [...this.jobs]; // Set initial filtered jobs to all jobs
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching job data', error);
        alert('Failed to load job listings. Please try again later.');
        this.loading = false;
      }
    );
  }

  // Fetch applied jobs for the logged-in user
  fetchAppliedJobs(): void {
    if (!this.isLoggedIn || !this.userEmail) return;

    this.http.get<any[]>(`http://localhost:3000/api/jobseeker-applied-jobs/${this.userEmail}`).subscribe(
      (data) => {
        console.log("Fetched applied jobs:", data); // Log the response to check the structure

        if (Array.isArray(data)) {
          this.appliedJobs = new Set(data.map(job => job.id));
          this.updateJobListWithAppliedStatus();
        } else {
          console.error("Expected an array of applied jobs, but got:", data);
        }
      },
      (error) => {
        console.error('Error fetching applied jobs:', error);
      }
    );
  }

  // Update the job list with the applied status after fetching applied jobs
  updateJobListWithAppliedStatus(): void {
    this.jobs = this.jobs.map(job => ( {
      ...job,
      applied: this.appliedJobs.has(job.id) // Mark job as applied
    }));
    this.filteredJobs = [...this.jobs]; // Update the filtered jobs list after updating applied status
  }

  // Apply for a job
  applyJob(jobId: number): void {
    if (!this.isLoggedIn || !this.userEmail) {
      alert('Please log in to apply for jobs.');
      return;
    }

    const payload = { jobId, email: this.userEmail };
    console.log('Sending apply payload:', payload);

    this.http.post('http://localhost:3000/api/apply-job', payload).subscribe(
      (response) => {
        alert('You have successfully applied for the job!');
        this.updateJobStatus(jobId); // Update the job status to "applied"
        this.appliedJobs.add(jobId); // Add job to appliedJobs Set
        localStorage.setItem('appliedJobs', JSON.stringify([...this.appliedJobs])); // Persist in localStorage
      },
      (error) => {
        console.error('Error applying for the job:', error);
        alert('Failed to apply for the job. Please try again later.');
      }
    );
  }

  // Mark job as applied
  updateJobStatus(jobId: number): void {
    this.jobs = this.jobs.map(job =>
      job.id === jobId ? { ...job, applied: true } : job // Update job status on UI
    );
    this.filteredJobs = [...this.jobs]; // Update the filtered jobs list
  }

  // Search jobs based on the search query
  searchJobs(): void {
    if (!this.searchQuery.trim()) {
      this.filteredJobs = [...this.jobs]; // Show all jobs if search query is empty
    } else {
      this.filteredJobs = this.jobs.filter(job =>
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.role.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  // Filter jobs by job type (Full-Time or Part-Time)
  filterJobsByJobType(): void {
    if (this.selectedJobType) {
      this.filteredJobs = this.jobs.filter(job => 
        job.type.toLowerCase() === this.selectedJobType.toLowerCase()
      );
    } else {
      this.filteredJobs = [...this.jobs]; // Show all jobs if no filter is selected
    }
  }
}
