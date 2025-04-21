import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:3000/api/jobs';  // Backend API URL

  constructor(private http: HttpClient) { }

  // Get all jobs
  getJobs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Delete a job
  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Update a job
  updateJob(id: number, jobData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, jobData);
  }
}
