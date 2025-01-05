import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  orderNumber: number;
  items: string[];
  amount: number;
  payment: string;
  date: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: Order[] = [];
  currentPageOrders: Order[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;
  apiUrl = 'http://localhost/backend-db';
  showConfirmDialog: boolean = false;
  orderToDelete: Order | null = null;
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrderHistory();
    const successMsg = localStorage.getItem('successMessage');
    if (successMsg) {
      this.successMessage = successMsg;
      localStorage.removeItem('successMessage');
    }
  }

  deleteOrder(order: Order): void {
    this.orderToDelete = order;
    this.showConfirmDialog = true;
  }

  confirmDeleteOrder(): void {
    if (!this.orderToDelete) return;

    const orderId = this.orderToDelete.orderNumber;

    this.http.request('DELETE', `${this.apiUrl}/deleteOrder.php`, {
      body: { orderId },
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response: any) => this.handleDeleteSuccess(response, orderId),
      error: (error: any) => this.handleDeleteError(error)
    });
  }

  handleDeleteSuccess(response: any, orderId: number): void {
    if (response.success) {
      this.orderHistory = this.orderHistory.filter(order => order.orderNumber !== orderId);
      this.updatePage();
      this.showSuccessMessage('Order deleted successfully!');
    } else {
      alert('Failed to delete order.');
    }
    this.showConfirmDialog = false;
  }

  handleDeleteError(error: any): void {
    console.error('Error deleting order:', error);
    alert('An error occurred while deleting the order.');
    this.showConfirmDialog = false;
  }

  showSuccessMessage(message: string): void {
    localStorage.setItem('successMessage', message);
    location.reload();
  }

  cancelDeleteOrder(): void {
    this.showConfirmDialog = false;
  }

  fetchOrderHistory(): void {
    this.http.get<{ success: boolean; data: Order[] }>(`${this.apiUrl}/getOrder.php`).subscribe({
      next: (response) => {
        if (response.success) {
          this.orderHistory = response.data;
          this.totalPages = Math.ceil(this.orderHistory.length / this.itemsPerPage);
          this.updatePage();
        } else {
          console.error('Failed to fetch order history.');
        }
      },
      error: (error) => console.error('Error fetching order history:', error)
    });
  }

  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentPageOrders = this.orderHistory.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }
}
