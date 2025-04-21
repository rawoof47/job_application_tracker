import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobListComponent },
  { path: 'post-job', component: JobFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
