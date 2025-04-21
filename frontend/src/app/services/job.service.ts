import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl = 'http://localhost:3000/api';  // Backend API URL

  constructor(private http: HttpClient) { }

  // Fetch jobs with the number of applications
  getJobsWithApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs-with-applications`);
  }

  // Get all jobs (basic)
  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs`);
  }

  // Save or update a job
  updateJob(jobId: number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/jobs/${jobId}`, jobData);
  }

  // Delete a job
  deleteJob(jobId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/jobs/${jobId}`);
  }
}
