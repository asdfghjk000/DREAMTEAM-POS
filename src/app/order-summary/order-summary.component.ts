import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient, private router: Router) {}

  calculateTotal(): number {
    return this.newOrder.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  calculateChange(): void {
    const total = this.calculateTotal();
    this.change = Math.max(0, this.paidAmount - total); // Prevent negative change
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

    if (this.paidAmount < this.calculateTotal()) {
      alert('Paid amount is less than the total. Please adjust.');
      return;
    }

    const orderData = {
      totalAmount: this.calculateTotal(),
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

    this.http.post('http://localhost/backend-db/saveOrder.php', orderData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Order saved successfully');
            this.resetOrder();
            this.orderConfirmed.emit(); // Emit event to notify parent component
            this.router.navigate(['/staff-dashboard'], { queryParams: { refresh: new Date().getTime() } });
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
