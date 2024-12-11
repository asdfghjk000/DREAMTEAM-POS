import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add if you need forms for any input functionality like search/filter

interface Order {
  orderNumber: number; // Change to number if orderNumber is an integer
  items: string[];
  amount: number;
  payment: string;
  date: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule if you want form functionality
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistory: Order[] = [];
  currentPageOrders: Order[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5; // Number of orders per page
  apiUrl = 'http://localhost/backend-db'; // Base URL for your PHP files
  showConfirmDialog: boolean = false;
  orderToDelete: any = null; 
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrderHistory();
  }

  deleteOrder(order: any): void {
    this.orderToDelete = order;  // Store the order to delete
    this.showConfirmDialog = true;  // Show the confirmation modal
  }

  // Method to confirm the deletion
  // Method to confirm the deletion 
  // Method to confirm the deletion 
// Method to confirm the deletion 
confirmDeleteOrder(): void {
  if (this.orderToDelete) {
    const orderId = this.orderToDelete.orderNumber;  // Get the order number to delete

    // Send a DELETE request to delete the order
    this.http.request('DELETE', `${this.apiUrl}/deleteOrder.php`, {
      body: { orderId: orderId },
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(
      (response: any) => {
        if (response.success) {
          // Remove the deleted order from the current page view
          this.currentPageOrders = this.currentPageOrders.filter(order => order.orderNumber !== orderId);
          // Optionally, refresh the order history
          this.fetchOrderHistory();

          // Display the success message in the Admin Dashboard by saving it to localStorage
          this.showSuccessMessage('Order deleted successfully!');
        } else {
          alert('Failed to delete order');
        }
        this.showConfirmDialog = false;  // Close the modal
      },
      (error) => {
        console.error('Error deleting order:', error);
        alert('An error occurred while deleting the order.');
        this.showConfirmDialog = false;  // Close the modal on error
      }
    );
  }
}

// Function to show success message
showSuccessMessage(message: string): void {
  localStorage.setItem('successMessage', message); // Store the success message in localStorage
}

  // Method to cancel the deletion
  cancelDeleteOrder(): void {
    this.showConfirmDialog = false;  // Close the modal without deleting
  }


  fetchOrderHistory(): void {
    // Fetch the order history
    this.http.get<{ success: boolean; data: Order[] }>(`${this.apiUrl}/getOrder.php`).subscribe(
      (response) => {
        if (response.success) {
          this.orderHistory = response.data;
          this.totalPages = Math.ceil(this.orderHistory.length / this.itemsPerPage);
          this.updatePage();
        } else {
          console.error('Failed to fetch order history.');
        }
      },
      (error) => {
        console.error('Error fetching order history:', error);
      }
    );
  }

  updatePage(): void {
    // Update the orders for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageOrders = this.orderHistory.slice(startIndex, endIndex);
  }

  previousPage(): void {
    // Navigate to the previous page
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    // Navigate to the next page
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }
}