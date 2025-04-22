import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Import your components
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JobseekerDashboardComponent } from './jobseeker-dashboard/jobseeker-dashboard.component';
import { HeaderComponent } from './header/header.component';

// Import your services
import { JobService } from './services/job.service';  // Adjust path if necessary
import { AuthService } from './services/auth.service';  // Adjust path if necessary

@NgModule({
  declarations: [
    AppComponent,
    JobFormComponent,
    JobListComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    JobseekerDashboardComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [JobService, AuthService],  // Add services here if not using @Injectable({ providedIn: 'root' })
  bootstrap: [AppComponent]
})
export class AppModule { }
