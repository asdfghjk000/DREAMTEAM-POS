import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface DeletedOrder {
  orderNumber: number;
  items: string[];
  amount: number;
  payment: string;
  date: string;
}

@Component({
  selector: 'app-bin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit {
  deletedOrders: DeletedOrder[] = [];
  currentPageOrders: DeletedOrder[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;
  showConfirmationModal: boolean = false;
  orderToRestore: DeletedOrder | null = null;
  successMessage: string = '';

  private apiUrl = 'http://localhost/backend-db';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDeletedOrders();
    const successMsg = localStorage.getItem('successMessage');
    if (successMsg) {
      this.successMessage = successMsg;
      localStorage.removeItem('successMessage');
    }
  }

  fetchDeletedOrders(): void {
    this.http.get<{ success: boolean; data: DeletedOrder[] }>(`${this.apiUrl}/deletedOrder.php`).subscribe({
      next: (response) => {
        if (response.success) {
          this.deletedOrders = response.data;
          this.totalPages = Math.ceil(this.deletedOrders.length / this.itemsPerPage);
          this.updatePage();
        } else {
          console.error('Failed to fetch deleted orders.');
        }
      },
      error: (err) => console.error('Error fetching deleted orders:', err)
    });
  }

  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentPageOrders = this.deletedOrders.slice(startIndex, startIndex + this.itemsPerPage);
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

  restoreOrder(order: DeletedOrder): void {
    this.orderToRestore = order;
    this.showConfirmationModal = true;
  }

  confirmRestore(): void {
    if (!this.orderToRestore) return;

    const orderId = this.orderToRestore.orderNumber;

    this.http.post<{ success: boolean }>(`${this.apiUrl}/restoreOrder.php`, { orderId }).subscribe({
      next: (response) => this.handleRestoreSuccess(response, orderId),
      error: (err) => this.handleRestoreError(err)
    });
  }

  handleRestoreSuccess(response: { success: boolean }, orderId: number): void {
    if (response.success) {
      this.deletedOrders = this.deletedOrders.filter(order => order.orderNumber !== orderId);
      this.updatePage();
      this.showSuccessMessage('Order restored successfully!');
    } else {
      alert('Failed to restore order.');
    }
    this.showConfirmationModal = false;
  }

  handleRestoreError(err: any): void {
    console.error('Error restoring order:', err);
    alert('An error occurred while restoring the order.');
    this.showConfirmationModal = false;
  }

  showSuccessMessage(message: string): void {
    localStorage.setItem('successMessage', message);
    location.reload();
  }

  cancelRestore(): void {
    this.showConfirmationModal = false;
  }
}