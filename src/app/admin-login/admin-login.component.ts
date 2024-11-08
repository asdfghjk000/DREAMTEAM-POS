// admin-login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  login(): void {
    console.log('Admin login attempt');
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    if (this.username === 'esheradmin2024' && this.password === 'eshercafepos') {
      console.log('Admin login successful, attempting navigation...');
      this.router.navigate(['/admin-dashboard'])
        .then(() => {
          console.log('Navigation successful');
        })
        .catch(error => {
          console.error('Navigation failed:', error);
        });
    } else {
      console.log('Invalid admin credentials');
      window.alert('Invalid username or password');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}