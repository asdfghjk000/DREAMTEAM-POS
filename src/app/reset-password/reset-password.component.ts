import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token: string = '';          // Store the token (usually retrieved from the URL)
  newPassword: string = '';    // New password entered by the user
  confirmPassword: string = ''; // Confirm password entered by the user
  message: string = '';        // To display success/error messages

  // A method to handle password reset logic
  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = "Passwords do not match!";
      return;
    }
    // Handle reset password logic here (e.g., call API to reset the password)
    console.log('Password reset logic for token:', this.token);
    this.message = 'Your password has been successfully reset.';
  }
}
