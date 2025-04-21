// jobseeker-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-jobseeker-dashboard',
  templateUrl: './jobseeker-dashboard.component.html',
  styleUrls: ['./jobseeker-dashboard.component.scss']
})
export class JobseekerDashboardComponent implements OnInit {

  jobs: any[] = [];  // Array to hold job list
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getJobs();
  }

  // Method to fetch the list of jobs from the backend
  getJobs(): void {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/api/jobs`)
      .subscribe(
        (response) => {
          this.jobs = response;
          this.loading = false;
        },
        (error) => {
          this.errorMessage = error.message || 'Failed to load jobs.';
          this.loading = false;
        }
      );
  }

  // Method to apply for a job by passing job ID
  applyForJob(jobId: number): void {
    // Here, you would normally send an API request to apply for the job
    // For now, just log the applied job ID
    console.log(`Applied for job with ID: ${jobId}`);
    // Logic to update the job application status would go here
  }
}
