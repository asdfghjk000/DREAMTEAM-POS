//THIS

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

  constructor(private router: Router, private authService: AuthService) {}

  login(): void {
    // Call the login method from AuthService
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.success) {
          // Process the encrypted response data
          this.authService.decryptRole(response.data).then((role) => {
            if (role) {
              // Set role and navigate based on role
              this.authService.setRole(role);
              if (role === 'staff') {
                this.router.navigate(['/staff-dashboard']);
              } else if (role === 'admin') {
                this.router.navigate(['/admin-dashboard']);
              } else {
                window.alert('Unknown role. Please contact the administrator.');
              }
            } else {
              window.alert('Error: Unable to decrypt role.');
            }
          }).catch((error) => {
            console.error('Decryption error:', error);
            this.errorMessage = 'Error while processing role. Please try again.';
          });
        } else {
          this.errorMessage = response.data 
            ? 'Invalid credentials. Please try again.' 
            : response.message || 'Login failed. Please try again.';
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