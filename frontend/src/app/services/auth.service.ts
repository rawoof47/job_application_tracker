// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Ensures the service is available globally in the app
})
export class AuthService {

  constructor() { }

  // Dummy method to get the logged-in user's email, replace with actual logic
  getUserEmail(): string {
    // You would normally get the user's email from a JWT token or a session
    return 'jobseeker@example.com'; // For demo purposes, returning a static email
  }

  // Add other methods like login, logout, and register if necessary
}
