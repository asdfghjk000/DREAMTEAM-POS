import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost/backend-db/'; // API endpoint

  constructor(private http: HttpClient) {}

  // Method for logging in
  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost/backend-db/login.php', { username, password }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getRole() {
    return localStorage.getItem('role'); // Get the role from localStorage
  }

  setRole(role: string) {
    localStorage.setItem('role', role); // Store the role in localStorage
  }

  clearRole() {
    localStorage.removeItem('role'); // Clear the role during logout
  }

  // Method for logging out (clears stored role)
  logout(): void {
    localStorage.removeItem('role');
  }
}
