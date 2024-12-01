import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Order {
  orderNumber: string;
  items: string[];
  amount: number;
  payment: string;
  date: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: Order[] = [];
  currentPageOrders: Order[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5; // Number of orders per page
  apiUrl = 'http://localhost/backend-db/getOrder.php'; // Update with your PHP file's URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrderHistory();
  }

  fetchOrderHistory(): void {
    this.http.get<{ success: boolean; data: Order[] }>(this.apiUrl).subscribe(
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
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageOrders = this.orderHistory.slice(startIndex, endIndex);
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
