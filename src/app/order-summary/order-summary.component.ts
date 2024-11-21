import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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
  paidAmount: number = 0; // User input for paid amount
  change: number = 0; // Calculated change
  paymentMethod: string | null = null; // Selected payment method

  constructor(private http: HttpClient) {}

  // Calculate total price of the order
  calculateTotal(): number {
    return this.newOrder.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Calculate change based on the paid amount
  calculateChange(): void {
    const total = this.calculateTotal();
    this.change = Math.max(0, this.paidAmount - total); // Prevent negative change
  }

  // Select payment method (e.g., Cash or GCash)
  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    console.log(`Payment method selected: ${method}`);
  }

  // Confirm the order and send data to the backend
  confirmOrder(): void {
    if (!this.paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    if (this.paidAmount < this.calculateTotal()) {
      alert('Paid amount is less than the total. Please adjust.');
      return;
    }
    
      // Prepare the order data to send to the PHP backend
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
    
      // Send order data to the backend
      this.http.post('http://localhost/backend-db/saveOrder.php', orderData)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              alert('Order saved successfully');
              // Reset the order after successful submission
              this.resetOrder();
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
    

  // Cancel the order
  cancelOrder(): void {
    if (confirm('Are you sure you want to cancel the order?')) {
      this.resetOrder();
      console.log('Order canceled.');
    }
  }

  // Reset order to initial state
  private resetOrder(): void {
    this.newOrder = [];
    this.paidAmount = 0;
    this.change = 0;
    this.paymentMethod = null;
  }

  // Lifecycle hook to set default paid amount
  ngOnInit(): void {
    const totalAmount = this.calculateTotal();
    this.paidAmount = totalAmount; // Set the paidAmount to the total initially
    this.calculateChange(); // Calculate the initial change
  }
}
