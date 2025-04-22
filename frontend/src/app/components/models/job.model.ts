export interface Job {
  id: number;            // Unique identifier for the job
  company: string;       // Company offering the job
  role: string;          // Role/title of the job
  salary: number;        // Salary for the job
  type: string;          // Full-time, Part-time, Contract, etc.
  postedDate: string;    // Date when the job was posted
  applied?: boolean;     // Indicates if the job has been applied by the current user
  appliedDate?: string;  // Date when the jobseeker applied (if applicable)
  userEmail?: string;    // Email of the jobseeker (if applicable)
  status?: 'Applied' | 'Interviewed' | 'Hired' | 'Rejected';  // Status of the application
}

export interface JobApplication {
  jobId: number;         // Refers to the job being applied to
  userEmail: string;     // Jobseeker's email
  appliedDate: string;   // Date the jobseeker applied
  status: 'Applied' | 'Interviewed' | 'Hired' | 'Rejected';  // Current application status
}