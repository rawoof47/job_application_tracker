import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  jobs: any[] = [];
  editingJobId: number | null = null;
  editForm: FormGroup;
  actionSuccess: boolean = false;
  actionMessage: string = '';

  constructor(
    private jobService: JobService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      salary: [0, Validators.required],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  // Fetch jobs from the server
  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      (response) => {
        this.jobs = response;
      },
      (error: any) => {
        console.error('Error fetching jobs:', error);
        alert('Error fetching jobs. Please try again later.');
      }
    );
  }

  // Delete a job by its ID
  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe(
        () => {
          console.log('Job deleted successfully');
          // Remove the job from the list immediately
          this.jobs = this.jobs.filter(job => job.id !== id);
          // Show success message
          this.actionSuccess = true;
          this.actionMessage = 'Job deleted successfully!';
          setTimeout(() => this.actionSuccess = false, 5000); // Hide the success message after 5 seconds
        },
        (error: any) => {
          console.error('Error deleting job:', error);
          alert('Error deleting job. Please try again later.');
        }
      );
    }
  }

  // Start editing a job
  startEditing(job: any): void {
    this.editingJobId = job.id;
    this.editForm.setValue({
      company: job.company,
      role: job.role,
      salary: job.salary,
      type: job.type
    });
  }

  // Cancel editing a job
  cancelEdit(): void {
    this.editingJobId = null;
    this.editForm.reset();
  }

  // Save the edited job
  saveJob(id: number): void {
    if (this.editForm.invalid) return;

    const updatedJob = this.editForm.value;

    this.jobService.updateJob(id, updatedJob).subscribe(
      () => {
        this.loadJobs(); // Reload job list after updating
        this.cancelEdit();
        // Show success message
        this.actionSuccess = true;
        this.actionMessage = 'Job updated successfully!';
        setTimeout(() => this.actionSuccess = false, 5000); // Hide the success message after 5 seconds
      },
      (error: any) => {
        console.error('Error updating job:', error);
        alert('Error updating job. Please try again later.');
      }
    );
  }
}
