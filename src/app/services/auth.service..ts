import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';  // Import for platform check

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost/backend-db/'; // API endpoint

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Method for logging in
  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost/backend-db/login.php', { username, password }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Method to safely get the user role
  getUserRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return user.role || '';  // Default to empty string if no role
    }
    return '';  // If not in browser, return empty string
  }

  // Get the role from localStorage (safe check for browser)
  getRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role') || '';  // Return role or empty string if not set
    }
    return '';  // Return an empty string if not in the browser
  }

  // Set the role in localStorage (safe check for browser)
  setRole(role: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('role', role);  // Set the role in localStorage
    }
  }

  // Clear the role during logout (safe check for browser)
  clearRole(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('role');  // Clear the role from localStorage
    }
  }

  // Method for logging out (clears stored role)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('role');  // Clear the role during logout
    }
  }
}