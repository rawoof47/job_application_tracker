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

  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      (response) => {
        this.jobs = response;
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe(
        () => {
          this.loadJobs();
        },
        (error) => {
          console.error('Error deleting job:', error);
        }
      );
    }
  }

  startEditing(job: any): void {
    this.editingJobId = job.id;
    this.editForm.setValue({
      company: job.company,
      role: job.role,
      salary: job.salary,
      type: job.type
    });
  }

  cancelEdit(): void {
    this.editingJobId = null;
    this.editForm.reset();
  }

  saveJob(id: number): void {
    if (this.editForm.invalid) return;

    const updatedJob = this.editForm.value;

    this.jobService.updateJob(id, updatedJob).subscribe(
      () => {
        this.loadJobs();
        this.cancelEdit();
      },
      (error) => {
        console.error('Error updating job:', error);
      }
    );
  }
}
