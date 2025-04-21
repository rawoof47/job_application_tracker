import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job.model';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.fetchJobs();
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  fetchJobs(): void {
    this.http.get<Job[]>('http://localhost:3000/api/jobs').subscribe(
      (data) => {
        // Set all jobs as not applied initially
        this.jobs = data.map(job => ({ ...job, applied: false }));
      },
      (error) => {
        console.error('Error fetching job data', error);
      }
    );
  }

  applyJob(jobId: number): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.post('http://localhost:3000/api/apply-job', { jobId, userId }).subscribe(
        () => {
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

  updateJobStatus(jobId: number): void {
    this.jobs = this.jobs.map(job =>
      job.id === jobId ? { ...job, applied: true } : job
    );
  }
}
