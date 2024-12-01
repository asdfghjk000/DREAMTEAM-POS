import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { Product } from '../products/products.component';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  standalone: true,
  imports: [CommonModule, OrderSummaryComponent],
})
export class NewOrderComponent {
  @Input() products: Product[] = []; // List of products passed from the parent
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() remove: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() updateQuantity: EventEmitter<{ product: Product; quantity: number }> = new EventEmitter();
  @Output() updateOrder: EventEmitter<Product[]> = new EventEmitter(); // Emit updated order list to parent
  @Output() orderClosed: EventEmitter<void> = new EventEmitter<void>(); // Event to notify parent that order is closed

  isPaymentCompleted: boolean = false;
  isOrderVisible: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  increaseQuantity(item: Product): void {
    item.quantity++; // Increase the quantity of the item
    this.updateQuantity.emit({ product: item, quantity: item.quantity });
    this.updateOrder.emit(this.products); // Emit updated list to the parent component
    this.cdr.detectChanges(); // Trigger change detection
  }
  
  decreaseQuantity(item: Product): void {
    if (item.quantity > 1) {
      item.quantity--; // Decrease the quantity of the item
      this.updateQuantity.emit({ product: item, quantity: item.quantity });
      this.updateOrder.emit(this.products); // Emit updated list to the parent component
      this.cdr.detectChanges(); // Trigger change detection
    }
  }
  

  removeItem(item: Product): void {
    this.products = this.products.filter((i) => i !== item); // Remove the item from the order
    this.remove.emit(item); // Emit the removed item
    this.updateOrder.emit(this.products); // Emit the updated list to the parent (AllItemsComponent)
    this.cdr.detectChanges(); // Manually trigger change detection to ensure the UI updates
  }
  
  calculateTotal(): number {
    return this.products.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  proceedToPayment(): void {
    console.log('Proceeding to payment...');
    this.isPaymentCompleted = true;
  }

  cancelOrder(): void {
    this.cancel.emit();
    this.products = [];
    this.isPaymentCompleted = false;
  }

  confirmOrder(): void {
    this.confirm.emit();
    this.closeOrder(); // Close the order summary
  }
  

  closeOrder(): void {
    // Perform any necessary clean-up steps or actions before closing the order
    this.isOrderVisible = false;  // Hide the current order view
    this.orderClosed.emit();      // Emit the orderClosed event to notify the parent component
  
    // Optionally, reset order-related data or perform any other actions
    console.log('Order closed, ready to refresh the dashboard');
  }

  handleCancelOrder(): void {
    this.products = []; // Reset products if order is canceled
  }

  handleConfirmOrder(): void {
    console.log('Order confirmed');
  }
}
