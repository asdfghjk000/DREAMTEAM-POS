import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';  // Import RouterModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AuthService } from '../services/auth.service'; // Import AuthService
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css'],
  imports: [HttpClientModule, RouterModule, FormsModule, ]  // Add RouterModule to imports
})

export class StaffLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    // Call the authentication service
    this.authService.authenticate(this.username, this.password).subscribe(
      (response) => {
        // If authentication is successful, navigate to staff dashboard
        if (response.success) {
          this.router.navigate(['/staff-dashboard']);
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      },
      (error) => {
        // Handle error if the API call fails
        this.errorMessage = 'Error occurred during authentication. Please try again later.';
      }
    );
  }
}