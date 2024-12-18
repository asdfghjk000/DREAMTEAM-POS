import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, AboutComponent, UsersComponent],
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})

export class SuperAdminComponent implements AfterViewInit {
  // Inject Router into the constructor
  constructor(private router: Router) {}

  // Floating success message
  successMessage: string = '';

  // Category-related properties
  currentCategory: string = 'users'; //Default

  // User-related properties
  users: any[] = [];

  // Method to change the current content based on sidebar navigation
  changeContent(category: string): void {
    this.currentCategory = category;
  }

  // Logout function
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/main']); // Now you can use 'router' since it's injected
  }

  // Logout modal
  showLogoutModal: boolean = false;

  // Open logout confirmation modal
  openLogoutConfirmation(): void {
    this.showLogoutModal = true;
  }

  // Confirm logout and redirect
  confirmLogout(): void {
    this.showLogoutModal = false;
    this.logout();
  }

  // Close logout confirmation modal
  closeLogout(): void {
    this.showLogoutModal = false;
  }

  // ngAfterViewInit method required by AfterViewInit interface
  ngAfterViewInit(): void {
    // You can add any logic that needs to run after the view is initialized
  }
}
