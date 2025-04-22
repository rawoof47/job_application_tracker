import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobService } from '../services/job.service';  // Ensure this service exists
import { AuthService } from '../services/auth.service';  // Ensure this service exists

@Component({
  selector: 'app-jobseeker-dashboard',
  templateUrl: './jobseeker-dashboard.component.html',
  styleUrls: ['./jobseeker-dashboard.component.scss']
})
export class JobseekerDashboardComponent implements OnInit {

  jobs: any[] = [];  // Array to hold job list
  loading: boolean = false;
  errorMessage: string = '';
  userEmail: string = '';  // User's email (jobseeker)

  constructor(
    private http: HttpClient,
    private jobService: JobService,
    private authService: AuthService // Ensure this service exists and is injectable
  ) {}

  ngOnInit(): void {
    // Get the logged-in user's email from the authService
    this.userEmail = this.authService.getUserEmail(); 
    if (this.userEmail) {
      console.log('User email:', this.userEmail);  // Log to check if email is fetched correctly
      this.getJobs(); // Call method to fetch jobs
    } else {
      console.error('User email not found.');
    }
  }

  // Method to fetch the list of jobs that the jobseeker has applied for
  getJobs(): void {
    this.loading = true; // Set loading state to true before making the request
    console.log('Fetching jobs for email:', this.userEmail); // Log to check if the correct email is being passed
    this.jobService.getAppliedJobs(this.userEmail)  // Fetch jobs applied by the user
      .subscribe(
        (response: any) => {
          console.log('Fetched applied jobs:', response);  // Log the response
          this.jobs = response.appliedJobs || [];  // Populate the jobs array with the applied jobs
          this.loading = false;  // Set loading state to false after the response
        },
        (error) => {
          console.error('Error fetching applied jobs:', error);  // Log the error
          this.errorMessage = error.message || 'Failed to load applied jobs.';  // Show error message
          this.loading = false;  // Set loading state to false if error occurs
        }
      );
  }

  // Method to apply for a job (optional, based on your existing functionality)
  applyForJob(jobId: number): void {
    console.log(`Applied for job with ID: ${jobId}`);
    this.jobService.applyForJob(jobId, this.userEmail).subscribe(
      (response) => {
        console.log('Job application response:', response);  // Log to verify the response
        this.getJobs(); // Re-fetch the applied jobs after applying
      },
      (error) => {
        console.error('Error applying for job:', error);
        this.errorMessage = 'Failed to apply for job.';  // Show error message
      }
    );
  }
}
