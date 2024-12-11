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
  // Floating success message
  successMessage: string = '';

  // Category-related properties
  currentCategory: string = 'sales'; // Default category

  // Product-related properties
  products: { imageUrl: string; productCode: string; productName: string; category: string; price: number }[] = [];
  private messageShown: boolean = false;

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

  // Handle floating success message
  ngAfterViewInit() {
    const storedMessage = localStorage.getItem('successMessage');  // Get message from localStorage
    if (storedMessage) {
      this.successMessage = storedMessage;

      // Display the message and clear it after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
        localStorage.removeItem('successMessage');  // Clear the message from localStorage
      }, 5000);
    }
  }

  ngOnInit(): void {
    // Check if a category message exists in localStorage
    const storedMessage = localStorage.getItem('categoryMessage');
  
    if (storedMessage) {
      // Display the message
      this.successMessage = storedMessage;
  
      // Clear the message from localStorage to avoid repeated display
      localStorage.removeItem('categoryMessage');

      setTimeout(() => {
        this.successMessage = '';
        localStorage.removeItem('successMessage');  // Clear the message from localStorage
      }, 5000);
    }
  }  
  


  // Example function for adding a product
  addProduct(product: any): void {
    // Logic to add product here
    // After successful addition:
    this.showSuccessMessage('Product added successfully!');
  }

  // Example function for deleting a product
  deleteProduct(productId: string): void {
    // Logic to delete product here
    // After successful deletion:
    this.showSuccessMessage('Product deleted successfully!');
  }

  // Function to show success message
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    
    // Optionally, you can also store this message in local storage if you want to persist it across navigation
    localStorage.setItem('successMessage', message);

    // Hide message after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
      localStorage.removeItem('successMessage');
    }, 3000);
  }
}
