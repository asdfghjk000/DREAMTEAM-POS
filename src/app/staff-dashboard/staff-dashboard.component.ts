import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; // Import FormsModule for two-way data binding

@Component({
  selector: 'app-staff-dashboard',  // Ensure the correct selector
  standalone: true,
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css'],
  imports: [CommonModule, FormsModule]  // Add FormsModule here for ngModel
})
export class StaffDashboardComponent {  // Change class name to match the component name
  currentCategory: string = 'sales'; // Default category
  newOrderModalVisible: boolean = false; // Flag to control modal visibility
  newOrderData: any = { productName: '', productPrice: '' }; // Initialize with fields for product name and price

  constructor() {}

  // Method to update selected category
  changeContent(category: string): void {
    this.currentCategory = category;
  }

  // Method to show new order modal
  createNewOrder(): void {
    this.newOrderModalVisible = true;  // Show modal
    console.log('New product order form opened');
  }

  // Method to submit the new order
  submitNewOrder(): void {
    console.log('New order submitted:', this.newOrderData);  // Handle submission logic
    this.closeModal();  // Close the modal after submitting
  }

  // Method to close the modal
  closeModal(): void {
    this.newOrderModalVisible = false;  // Hide modal
  }
}
