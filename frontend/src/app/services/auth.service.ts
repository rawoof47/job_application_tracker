import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Ensures the service is available globally in the app
})
export class AuthService {

  constructor() { }

  // ✅ Store the user's email in localStorage after login
  login(userEmail: string): void {
    localStorage.setItem('userEmail', userEmail);
  }

  // ✅ Get the logged-in user's email from localStorage
  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  // Add other methods like logout, and register if necessary
}
