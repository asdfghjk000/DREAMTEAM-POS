import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryComponent } from '../category/category.component';
import { ProductsComponent } from "../products/products.component";
import { OrderHistoryComponent } from "../order-history/order-history.component";
import { SalesComponent } from "../sales/sales.component";
import { CommonModule } from '@angular/common';
import { ReportsComponent } from "../reports/reports.component";
import { AboutComponent } from "../about/about.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CategoryComponent, ProductsComponent, OrderHistoryComponent, SalesComponent, CommonModule, ReportsComponent,
    AboutComponent
],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit {
  // Category-related properties
  currentCategory: string = 'sales'; // Default category

  // Product-related properties
  products: { imageUrl: string; productCode: string; productName: string; category: string; price: number }[] = [];

  // Change content based on the selected category
  changeContent(category: string): void {
    this.currentCategory = category;
  }

  // Generate category code (assuming you have a category list in place)
  generateCategoryCode(): string {
    const codeLength = 3;
    const lastCategory = this.products[this.products.length - 1]; // You might change this to categories if you use them
    const newCodeNumber = lastCategory ? parseInt(lastCategory.productCode) + 1 : 1;
    return newCodeNumber.toString().padStart(codeLength, '0');
  }

  // Logout function
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/main']);
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

  constructor(private router: Router) {}

  ngAfterViewInit() {
    // Remove drag functionality if not needed
  }
}
