import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html'
})
export class JobFormComponent {
  job = {
    company: '',
    role: '',
    salary: 0,
    type: ''
  };

  constructor(private http: HttpClient, private router: Router) {}  // Inject Router

  submitJob() {
    this.http.post('http://localhost:3000/api/jobs', this.job).subscribe(
      res => {
        alert('Job posted successfully!');
        this.job = { company: '', role: '', salary: 0, type: '' };

        // Navigate to the dashboard page after posting the job
        this.router.navigate(['/dashboard']);
      },
      err => {
        alert('Error posting job!');
        console.error(err);
      }
    );
  }
}
