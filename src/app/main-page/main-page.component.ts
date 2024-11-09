import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,  // This makes it standalone
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  constructor(private router: Router) {}

  navigateToLogin(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin-login']);
    } else if (role === 'staff') {
      this.router.navigate(['/staff-login']);
    }
  }
}