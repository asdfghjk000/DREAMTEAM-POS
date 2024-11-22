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
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: Order[] = [];
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
        } else {
          console.error('Failed to fetch order history.');
        }
      },
      (error) => {
        console.error('Error fetching order history:', error);
      }
    );
  }
}
