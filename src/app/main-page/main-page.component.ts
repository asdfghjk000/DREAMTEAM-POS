// src/app/main-page/main-page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  title = 'esher-cafe';
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  login(): void {
    const loginData = { Username: this.username, Password: this.password };

    this.http.post<any>('http://localhost/backend-db/login.php', loginData).subscribe(
      (response) => {
        if (response.success) {
          const role = response.user?.Role;

          if (role === 'staff') {
            this.authService.setRole('staff');
            this.router.navigate(['/staff-dashboard']);
          } else if (role === 'admin') {
            this.authService.setRole('admin');
            this.router.navigate(['/admin-dashboard']);
          } else {
            window.alert('Unknown role. Please contact the administrator.');
          }
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      (error) => {
        console.error('Error during login:', error);
        this.errorMessage = 'Unable to login. Please try again later.';
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
