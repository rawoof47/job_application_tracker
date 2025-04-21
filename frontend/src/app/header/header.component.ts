import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  // Handle logout action
  logout() {
    localStorage.removeItem('token');  // Remove the token to log out
    this.router.navigate(['/login']);  // Redirect to login page
  }

  // Navigate to Home Page (for the logo)
  goToHome() {
    this.router.navigate(['/']);  // Navigate to the home page
  }
}
