import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    this.userRole = localStorage.getItem('role');
  }

  goToDashboard(): void {
    if (this.userRole === 'jobseeker') {
      this.router.navigate(['/jobseeker-dashboard']);
    } else if (this.userRole === 'recruiter') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('User role not recognized.');
    }
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}
