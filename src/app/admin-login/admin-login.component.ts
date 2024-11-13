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
    if (this.username === 'esheradmin2024' && this.password === 'eshercafe') {
      this.router.navigate(['/admin-dashboard'])
        .then(() => console.log('Navigation successful'))
        .catch(error => console.error('Navigation failed:', error));
    } else {
      window.alert('Invalid username or password');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}