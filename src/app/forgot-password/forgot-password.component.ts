import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  username: string = '';  // Username input field
  email: string = '';     // Email input field
  message: string | null = null;  // Message to show feedback to the user
  isSubmitting: boolean = false;  // Flag to track form submission status
  isUsernameStep: boolean = true; // Flag to track if the form is on the username step

  constructor(private http: HttpClient, private router: Router) {}

  // Navigates back to the login page
  navigateToMainPage(): void {
    this.router.navigate(['/login']);
  }


  verifyUser(): void {
    // Check if the username is provided
    if (!this.username || this.username.trim() === '') {
      this.message = 'Please enter a username.';
      return;
    }
  
    // Start submitting process
    this.isSubmitting = true;
    
    // Send a request to the backend to retrieve the list of users
    this.http.get<any>('http://localhost/backend-db/credentials.php').subscribe(
      (response) => {
        if (response.success) {
          // Check if the username exists in the response
          const userExists = response.users.some((user: any) => user.Username === this.username);
  
          if (userExists) {
            // Username exists, proceed to the next step (email input)
            this.isUsernameStep = false;
            this.message = 'Username found, proceed to reset password.';
          } else {
            // Username doesn't exist in the list
            this.message = 'Username not found. Please try again.';
          }
        } else {
          // Handle any failure in retrieving the users list
          this.message = 'Failed to retrieve user data. Please try again later.';
        }
        this.isSubmitting = false;
      },
      (error) => {
        // Handle error during the request
        console.error('Error during username verification:', error);
        this.message = 'An error occurred while verifying the username. Please try again later.';
        this.isSubmitting = false;
      }
    );
  }
  
  submitEmail(): void {
    if (!this.email || this.email.trim() === '') {
      this.message = 'Please enter your registered email.';
      return;
    }

    this.isSubmitting = true;

    // Send email to backend to handle password reset
    const emailData = { email: this.email };
    this.http.post<any>('http://localhost/backend-db/forgot-password.php', emailData).subscribe(
      (response) => {
        if (response.success) {
          this.message = 'A password reset link has been sent to your email.';
        } else {
          this.message = response.message || 'Failed to send reset email. Please try again later.';
        }
        this.isSubmitting = false;
      },
      (error) => {
        console.error('Error during email submission:', error);
        this.message = 'An error occurred while sending the password reset link. Please try again later.';
        this.isSubmitting = false;
      }
    );
  }
  
}
