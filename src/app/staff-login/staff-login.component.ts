// src/app/staff-login/staff-login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  login(): void {
    if (this.username === 'esherstaff2024' && this.password === 'eshercafe') {
      this.router.navigate(['/staff-dashboard'])
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