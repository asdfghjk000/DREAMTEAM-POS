import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AllItemsComponent } from '../all-items/all-items.component';
import { FoodsComponent } from "../foods/foods.component";
import { DrinksComponent } from "../drinks/drinks.component";
import { NewOrderComponent } from '../new-order/new-order.component';
import { Product } from '../products/products.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatMenuModule, AllItemsComponent, FoodsComponent, DrinksComponent, NewOrderComponent],
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent {
  currentCategory: string = 'allItems'; // Default to 'allItems'
  selectedProducts: any[] = [];  // Track selected products
  currentOrder: any[] = [];
  errorMessage!: string;
  isOrderConfirmed: boolean = false;  // Track if the order is confirmed
  showOrderComponents: boolean = true; // Show/Hide New Order and Summary
  orderProducts: Product[] = []; // Store products for new order
  showLogoutModal: boolean = false; // For logout modal visibility

  // Inject the DashboardService to trigger the refresh
  constructor(private router: Router, private dashboardService: DashboardService) {}

  // Method to change the main category
  changeContent(category: string): void {
    this.currentCategory = category;
  }

  // Method to handle product selection in AllItems, Foods, Drinks
  selectProduct(product: any): void {
    const existingProduct = this.selectedProducts.find(p => p.productName === product.productName);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      this.selectedProducts.push({ ...product, quantity: 1 });
    }
  }

  // Handle the order confirmation event
  onOrderConfirmed(): void {
    this.isOrderConfirmed = true;
    this.selectedProducts = [];  // Clear the selected products after confirming
    this.closeNewOrder(); // Close the new order container when the order is confirmed

    // Trigger the dashboard refresh after order confirmation
    this.dashboardService.triggerDashboardRefresh();
  }

  // Close the New Order container when it is closed manually
  closeNewOrder(): void {
    this.selectedProducts = [];  // Clear the selected products
    this.isOrderConfirmed = false; // Reset the order confirmation state
  }

  // Logout function
  logout(): void {
    // Clear any session data or authentication tokens
    localStorage.removeItem('authToken'); // Example of clearing a token from local storage
    // Redirect the user to the login page
    this.router.navigate(['/main']); // Adjust this route based on your actual login page route
  }

  // Open the logout confirmation modal
  openLogoutConfirmation(): void {
    this.showLogoutModal = true;
  }

  // Confirm logout and perform actions
  confirmLogout(): void {
    this.showLogoutModal = false;
    // Clear session data or authentication tokens
    localStorage.removeItem('authToken'); // Example of clearing a token from local storage
    // Redirect to the login page
    this.router.navigate(['/main']); // Adjust the route based on your login page
  }

  // Close the logout confirmation modal
  closeLogout(): void {
    this.showLogoutModal = false;
  }
}
