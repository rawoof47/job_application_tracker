import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../components/models/job.model'; // Correct path to job.model.ts

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl = 'http://localhost:3000/api';  // Backend API URL

  constructor(private http: HttpClient) { }

  // Fetch jobs with the number of applications
  getJobsWithApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs-applications`);
  }

  // Get all jobs (basic)
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  // Save or update a job
  updateJob(jobId: number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/jobs/${jobId}`, jobData);
  }

  // Delete a job
  deleteJob(jobId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/jobs/${jobId}`);
  }

  // Apply for a job
  applyForJob(jobId: number, userEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/apply-job`, { jobId, userEmail });
  }

  // Get all jobs applied by a specific jobseeker (by email)
  getAppliedJobs(userEmail: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobseeker-applied-jobs/${userEmail}`);
  }
}
