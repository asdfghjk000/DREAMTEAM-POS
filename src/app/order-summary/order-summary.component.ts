import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { ModalComponent } from "../modal/modal.component";

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
  warningMessage: string = '';
  showConfirmDialog: boolean = false;
  cdr: any;
  orderSummaryClosed: any;
  successMessage: any;
  isPaymentCompleted!: boolean;
  isOrderVisible!: boolean;
  showOrderSuccessModal: any;

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
    this.warningMessage = ''; // Clear any previous warning messages
    this.successMessage = ''; // Clear any previous success messages
  
    // Validate payment method selection
    if (!this.paymentMethod) {
      this.warningMessage = 'Please select a payment method.';
      return;
    }
  
    // Calculate the total amount (after discount if applicable)
    const totalAfterDiscount = this.calculateTotalAfterDiscount
      ? this.calculateTotalAfterDiscount()
      : this.calculateTotal();
  
    // Validate if paid amount is sufficient
    if (this.paidAmount < totalAfterDiscount) {
      this.warningMessage = 'Paid amount is less than the total. Please adjust.';
      return;
    }
  
    // Prepare the order data
    const orderData = {
      totalAmount: totalAfterDiscount,
      paymentMethod: this.paymentMethod,
      paidAmount: this.paidAmount,
      change: this.change,
      items: this.newOrder.map((item) => ({
        productID: item.productID,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    };
  
    // Send the order data to the backend
    this.http.post('http://localhost/backend-db/saveOrder.php', orderData).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Store success message in local storage
          localStorage.setItem('successMessage', 'Order Successful!');
          
          // Reset the order state
          this.resetOrder();
  
          // Emit necessary events
          this.orderConfirmed.emit();
          this.orderSummaryClosed?.emit();
  
          // Trigger the modal on order success and navigate to staff dashboard
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/staff-dashboard']); // Staff dashboard
          });
        } else {
          this.warningMessage = 'Error saving order: ' + response.message;
        }
      },
      error: (err) => {
        console.error('Error occurred:', err);
        this.warningMessage = 'An error occurred while saving the order.';
      },
    });
  }
  

  showOrderSuccess() {
    this.showOrderSuccessModal = true;
  }
  
  closeOrderSuccessModal() {
    this.showOrderSuccessModal = false;
  }
  

  cancelOrder(): void {
    this.cancel.emit();
    this.isPaymentCompleted = false;
    this.isOrderVisible = true;
    console.log('Order canceled, returning to main order view with current products');
  }


resetToDefaultDisplay(): void {
  // Modify to preserve current products
  this.isPaymentCompleted = false;
  this.isOrderVisible = true;
  this.cdr.detectChanges();
}

handleCancelOrder(): void {
    // Call the existing cancelOrder method which already handles most of the reset logic
    this.cancelOrder();
    
    // Additional checks or custom logic if needed
    this.isOrderVisible = true; // Ensure the order view is visible again
    this.isPaymentCompleted = false; // Reset payment state
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
