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
  itemToDelete: Product | null = null;
  newOrder: never[] = [];
  paidAmount!: number;
  change!: number;
  paymentMethod!: null;
  
  showDeleteConfirmation(item: Product): void {
    this.itemToDelete = item; // Store the item to be deleted
    this.showConfirmDialog = true; // Show the confirmation modal
  }

  confirmRemoveItem(): void {
    if (!this.itemToDelete) return;
  
    const index = this.products.findIndex(p => p.productID === this.itemToDelete!.productID);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.remove.emit(this.itemToDelete); // Emit the removed item
      this.updateOrder.emit([...this.products]); // Update the order with the new products list
      this.itemToDelete = null; // Clear the item to be deleted
    }
  
    // Close the confirmation dialog after the item has been removed
    this.showConfirmDialog = false;
  
    // Trigger change detection again to ensure the modal is hidden
    this.cdr.detectChanges();
  }
  
  
  cancelRemoveItem(): void {
  this.showConfirmDialog = false; // Close the confirmation dialog
  this.itemToDelete = null; // Clear the item to be deleted
}



  @Input() products: Product[] = []; // List of products passed from the parent
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() remove: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() updateQuantity: EventEmitter<{ product: Product; quantity: number }> = new EventEmitter();
  @Output() updateOrder: EventEmitter<Product[]> = new EventEmitter(); // Emit updated order list to parent
  @Output() orderClosed: EventEmitter<void> = new EventEmitter<void>(); // Event to notify parent that order is closed

  isPaymentCompleted: boolean = false;
  isOrderVisible: boolean = true;
  cdr: any;
  showConfirmDialog: boolean = false;

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
    const index = this.products.findIndex(p => p.productID === item.productID);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.remove.emit(item);
      this.updateOrder.emit([...this.products]); // Create a new array reference
      this.cdr.detectChanges();
    }
  }
  calculateTotal(): number {
    return this.products.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  proceedToPayment(): void {
    this.isPaymentCompleted = true;
  }

  cancelOrder(): void {
    this.cancel.emit();
    this.isPaymentCompleted = false;
    this.isOrderVisible = true;
    console.log('Order canceled, returning to main order view with current products');
  }

  confirmOrder(): void {
    this.confirm.emit();
    this.closeOrder(); // Close the order summary
  }

  closeOrder(): void {
    // Clear all items and notify parent about the updated order
    while (this.products.length > 0) {
      const item = this.products.pop(); // Remove the last item
      if (item) {
        this.remove.emit(item); // Emit the removed item
      }
    }
  
    this.updateOrder.emit([]); // Emit an empty product list
    this.resetToDefaultDisplay(); // Reset the state to default
    this.isOrderVisible = false; // Hide the current order view
    this.orderClosed.emit(); // Notify the parent component
  
    console.log('Order closed, products cleared, and dashboard reset');
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

  handleConfirmOrder(): void {
    console.log('Order confirmed');
  }
}
