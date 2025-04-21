import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.http.post(`${environment.apiUrl}/api/login`, { email, password })
      .subscribe(
        (response: any) => {
          // Store JWT token and role
          localStorage.setItem('token', response.token); // Store JWT token
          localStorage.setItem('userId', response.userId); // Store user ID
          localStorage.setItem('role', response.role); // Store user role

          // Redirect user based on their role
          if (response.role === 'recruiter') {
            this.router.navigate(['/dashboard']); // Recruiter dashboard
          } else if (response.role === 'jobseeker') {
            this.router.navigate(['/jobseeker-dashboard']); // Jobseeker dashboard
          }
        },
        (error) => {
          this.loading = false;
          this.errorMessage = error.error.message || 'Login failed. Please try again.';
        }
      );
  }
}
