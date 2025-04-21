import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job.model'; // Assuming 'job-list' is in the 'components' folder

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = []; // Type the jobs array using the Job interface
  isLoggedIn: boolean = false; // Flag to track login status

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.fetchJobs();
  }

  // Check if the user is logged in
  checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token; // If token exists, user is logged in
  }

  // Fetch jobs from the backend
  fetchJobs(): void {
    this.http.get<Job[]>('http://localhost:3000/api/jobs').subscribe(
      (data) => {
        this.jobs = data;
      },
      (error) => {
        console.error('Error fetching job data', error);
      }
    );
  }

  // Apply for a job
  applyJob(jobId: number): void {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (userId) {
      this.http.post('http://localhost:3000/api/apply-job', { jobId, userId }).subscribe(
        (response) => {
          alert(`You have successfully applied for the job!`);
          this.updateJobStatus(jobId);
        },
        (error) => {
          console.error('Error applying for the job', error);
        }
      );
    } else {
      alert('Please log in to apply for jobs.');
    }
  }

  // Update the job status after applying
  updateJobStatus(jobId: number): void {
    // Update the job data to reflect that this user has applied
    this.jobs = this.jobs.map(job => 
      job.id === jobId ? { ...job, applied: true } : job
    );
  }

  // Logout functionality
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isLoggedIn = false; // Set login status to false
    this.router.navigate(['/login']); // Redirect to login page
  }
}
