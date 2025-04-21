// src/app/components/job-list/job-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job.model';  // This assumes 'job-list' is in 'components' folder

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = []; // Type the jobs array using the Job interface

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Job[]>('http://localhost:3000/api/jobs').subscribe(
      (data) => {
        this.jobs = data;
      },
      (error) => {
        console.error('Error fetching job data', error);
      }
    );
  }

  applyJob(jobId: number): void {
    alert(`You have applied for job with ID: ${jobId}`);
  }
}
