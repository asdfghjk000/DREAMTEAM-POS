import { Component, Input, Output, EventEmitter, ɵresetCompiledComponents } from '@angular/core';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { Product } from '../products/products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  standalone: true,
  imports: [OrderSummaryComponent, CommonModule],
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

  increaseQuantity(item: Product): void {
    item.quantity++; // Increase the quantity of the item
    this.updateQuantity.emit({ product: item, quantity: item.quantity });
    this.updateOrder.emit(this.products); // Emit updated list to the parent component
  }
  
  decreaseQuantity(item: Product): void {
    if (item.quantity > 1) {
      item.quantity--; // Decrease the quantity of the item
      this.updateQuantity.emit({ product: item, quantity: item.quantity });
      this.updateOrder.emit(this.products); // Emit updated list to the parent component
    }
  }

  removeItem(item: Product): void {
    this.products = this.products.filter((i) => i !== item); // Remove the item from the order
    this.remove.emit(item); // Emit the removed item
    this.updateOrder.emit(this.products); // Emit the updated list to the parent (AllItemsComponent)
  }

  calculateTotal(): number {
    return this.products.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  proceedToPayment(): void {
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
    this.isOrderVisible = false;  // Hide the current order view
    this.orderClosed.emit();      // Emit the orderClosed event to notify the parent component
  }

  handleCancelOrder(): void {
    this.products = []; // Reset products if order is canceled
  }

  handleConfirmOrder(): void {
    console.log('Order confirmed');
  }
}
