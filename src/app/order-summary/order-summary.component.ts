import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  imports: [CommonModule, FormsModule],
})
export class OrderSummaryComponent implements OnInit {
  @Input() newOrder: any[] = []; // Receive newOrder from parent
  @Output() orderConfirmed = new EventEmitter<void>(); // Emit event when order is confirmed
  @Output() cancel = new EventEmitter<void>(); // Emit event when cancel is clicked
  @Output() updateOrder = new EventEmitter<any[]>(); // Emit updated order back to parent

  paidAmount: number = 0;
  change: number = 0;
  paymentMethod: string | null = null;
  discount: number = 0; // Discount percentage

  constructor(
    private http: HttpClient, 
    private router: Router,
    private dashboardService: DashboardService // Inject DashboardService
  ) {}

  calculateTotal(): number {
    return this.newOrder.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  calculateTotalAfterDiscount(): number {
    const total = this.calculateTotal();
    const discountAmount = (this.discount / 100) * total;
    return total - discountAmount;
  }

  calculateChange(): void {
    const totalAfterDiscount = this.calculateTotalAfterDiscount();
    this.change = Math.max(0, this.paidAmount - totalAfterDiscount); // Prevent negative change
  }

  applyDiscount(): void {
    if (this.discount < 0) {
      this.discount = 0; // Prevent negative discount values
    } else if (this.discount > 100) {
      this.discount = 100; // Prevent discount values greater than 100
    }

    // Set paidAmount equal to the total after discount
    this.paidAmount = this.calculateTotalAfterDiscount();

    this.calculateChange(); // Recalculate change after discount
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    console.log(`Payment method selected: ${method}`);
  }

  confirmOrder(): void {
    if (!this.paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    const totalAfterDiscount = this.calculateTotalAfterDiscount();
    if (this.paidAmount < totalAfterDiscount) {
      alert('Paid amount is less than the total after discount. Please adjust.');
      return;
    }

    const orderData = {
      totalAmount: totalAfterDiscount, // Use the discounted total
      paymentMethod: this.paymentMethod,
      paidAmount: this.paidAmount,
      change: this.change,
      items: this.newOrder.map(item => ({
        productID: item.productID,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    // Send the order data to the backend for saving
    this.http.post('http://localhost/backend-db/saveOrder.php', orderData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Order saved successfully');
            this.resetOrder(); // Reset the order after confirming
            this.orderConfirmed.emit(); // Emit event to notify the parent component

            // Trigger the refresh in DashboardService
            this.dashboardService.triggerDashboardRefresh();
          } else {
            alert('Error saving order: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error occurred:', err);
          alert('An error occurred while saving the order.');
        },
      });
  }

  cancelOrder(): void {
    if (confirm('Are you sure you want to cancel the order?')) {
      this.resetOrder();
      console.log('Order canceled.');
      this.cancel.emit();
    }
  }

  private resetOrder(): void {
    this.newOrder = [];
    this.paidAmount = 0;
    this.change = 0;
    this.paymentMethod = null;
  }

  ngOnInit(): void {
    const totalAmount = this.calculateTotal();
    this.paidAmount = totalAmount; // Set the paidAmount to the total initially
    this.calculateChange();
  }
}
