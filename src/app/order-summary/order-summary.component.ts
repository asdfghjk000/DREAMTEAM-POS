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
orderData: any;
  discountPercentage: any;
downloadReceipt() {
throw new Error('Method not implemented.');
}

  selectOrderType(type: string) {
    this.orderType = type;
  }

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
  deleteMessage: any;
  showConfirmationModal: boolean = false;
  orderType: string = '';;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private dashboardService: DashboardService // Inject DashboardService
  ) {}

  calculateTotal(): number {
    return this.newOrder.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  calculateTotalAfterDiscount(): number {
    const totalBeforeDiscount = this.calculateTotal();
    const discountAmount = (totalBeforeDiscount * this.discount) / 100;
    return totalBeforeDiscount - discountAmount;
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

    // Show the confirmation modal instead of proceeding directly
    this.showConfirmationModal = true;
  }

  calculateDiscountAmount(): number {
    return (this.calculateTotal() * this.discount) / 100;
  }

  
  totalBeforeDiscount: number = 0;

finalizeOrder(confirm: boolean): void { 
    if (confirm) {
        // Calculate total before discount (subtotal)
        this.totalBeforeDiscount = this.calculateTotal();  // Subtotal (Total before discount)
        
        // Calculate total after discount
        const totalAfterDiscount = this.calculateTotalAfterDiscount();  // Total after applying discount

        // Create the order data object
        const orderData = {
            totalAmount: totalAfterDiscount,
            paymentMethod: this.paymentMethod,
            paidAmount: this.paidAmount,
            change: this.change,
            orderType: this.orderType,
            items: this.newOrder.map((item) => ({
                productID: item.productID,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
            })),
            discountPercentage: this.discount,  // Use the discount value (percentage)
            totalBeforeDiscount: this.totalBeforeDiscount,  // Include the subtotal in order data
        };

        // Send order data to backend
        this.http.post('http://localhost/backend-db/saveOrder.php', orderData).subscribe({
            next: (response: any) => {
                if (response.success) {
                    // Save success message and reset order
                    localStorage.setItem('successMessage', 'Order Successful!');
                    this.resetOrder();
                    this.orderConfirmed.emit();
                    this.orderSummaryClosed?.emit();

                    // Print the receipt
                    this.printReceipt(orderData);

                    // Redirect to dashboard
                    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/staff-dashboard']);
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

    // Close the confirmation modal
    this.showConfirmationModal = false;
}
  
printReceipt(orderData: any): void {
  const receiptWindow = window.open('', '_blank', 'width=400,height=600');
  if (receiptWindow) {
    const receiptContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              @page {
                size: 58mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-size: 12px;
                line-height: 1.4;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10px;
              width: 58mm;
              line-height: 1.4;
              text-align: left;
            }
            .header, .footer {
              text-align: center;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .header h2 {
              margin: 5px 0;
              font-size: 14px;
            }
            .line {
              border-top: 1px dashed #000;
              margin: 5px 0;
            }
            .item, .totals {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
            }
            .totals span {
              font-weight: bold;
            }
            .center {
              text-align: center;
              margin-top: 5px;
            }
            .footer {
              margin-top: 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <!-- Receipt Header -->
          <div class="header">
            <h2>ESHER CAFE</h2>
            <p>${new Date().toLocaleString()}</p>
          </div>
          <div class="line"></div>

          <!-- Items -->
          <div>
            ${orderData.items
              .map(
                (item: any) => `
                <div class="item">
                  <span>${item.productName} x ${item.quantity}</span>
                  <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `
              )
              .join('')}
          </div>
          <div class="line"></div>

          <!-- Totals Section -->
          <div class="totals">
            <span>Subtotal:</span>
            <span>₱${orderData.totalBeforeDiscount.toFixed(2)}</span> <!-- Change here -->
          </div>
          <div class="totals">
            <span>Discount:</span>
            <span> ${orderData.discountPercentage}%</span>
          </div>
          <div class="totals">
            <span>Total:</span>
            <span>₱${orderData.totalAmount.toFixed(2)}</span>
          </div>
          <div class="totals">
            <span>Paid:</span>
            <span>₱${orderData.paidAmount.toFixed(2)}</span>
          </div>
          <div class="totals">
            <span>Change:</span>
            <span>₱${orderData.change.toFixed(2)}</span>
          </div>
          <div class="line"></div>

          <!-- Order Type and Payment Method -->
          <div class="center">
            <span><strong>${orderData.orderType}</strong></span>
          </div>
          <div class="center">
            <span><strong>${orderData.paymentMethod}</strong></span>
          </div>
          <div class="line"></div>

          <!-- Footer -->
          <div class="footer">
            <p>THANK YOU!</p>
          </div>
        </body>
      </html>
    `;  
    // Write and trigger print
    receiptWindow.document.open();
    receiptWindow.document.write(receiptContent);
    receiptWindow.document.close();
    receiptWindow.print();
  }
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
