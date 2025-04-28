import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';  // Recruiter Dashboard
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JobseekerDashboardComponent } from './jobseeker-dashboard/jobseeker-dashboard.component';  // Jobseeker Dashboard

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },   // 👈 Default page changed to Login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'post-job', component: JobFormComponent },
  { path: 'dashboard', component: DashboardComponent },  // Recruiter Dashboard
  { path: 'jobseeker-dashboard', component: JobseekerDashboardComponent },  // Jobseeker Dashboard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
