import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service.';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  title = 'esher-cafe';
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string | null = null; // Define errorMessage property

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  login(): void {
    const registrationData = { Username: this.username, Password: this.password };
    this.http.post<any>('http://localhost/backend-db/login.php', registrationData).subscribe(
      (response) => {
        if (response.success) {
          const role = response.user?.Role; // Dynamically fetched role
  
          if (role === 'staff') {
            this.authService.setRole('staff');  // Set role in localStorage
            this.router.navigate(['/staff-dashboard']);
          } else if (role === 'admin') {
            this.authService.setRole('admin');  // Set role in localStorage
            this.router.navigate(['/admin-dashboard']);
          } else {
            window.alert('Unknown role. Please contact the administrator.');
          }
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.'; // Set the errorMessage
        }
      },
      (error) => {
        console.error('Error during login:', error);
        this.errorMessage = 'Unable to login. Please try again later.'; // Set the errorMessage
      }
    );
  }
  

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}