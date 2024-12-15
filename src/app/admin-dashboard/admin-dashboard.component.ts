import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule
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

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  // Check for stored success message in localStorage
  const successMessage = localStorage.getItem('successMessage');
  const categoryMessage = localStorage.getItem('categoryMessage');
  
  // Display the success message if available, otherwise display the category message
  if (successMessage) {
    this.successMessage = successMessage;
    localStorage.removeItem('successMessage'); // Remove after displaying
  } else if (categoryMessage) {
    this.successMessage = categoryMessage;
    localStorage.removeItem('categoryMessage'); // Remove after displaying
  }

  // Clear the message after 5 seconds
  if (this.successMessage) {
    setTimeout(() => {
      this.successMessage = '';
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
