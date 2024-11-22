import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSummaryComponent } from "../order-summary/order-summary.component";

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  standalone: true,
  imports: [CommonModule, OrderSummaryComponent]
})
export class NewOrderComponent implements OnInit {
  @Input() products: any[] = []; // Receive selected products
  isPaymentCompleted: boolean = false; // Track payment status
  selectedProduct: any;  // Selected product to add

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log(this.products); // Verify if products are being passed correctly
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.cdr.detectChanges();  // Ensure changes are reflected in the view
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cdr.detectChanges();  // Ensure changes are reflected in the view
    }
  }

  removeItem(item: any) {
    this.products = this.products.filter(i => i !== item);
    this.cdr.detectChanges();  // Manually trigger change detection
  }

  addNewItem(product: any) {
    if (!product) return;

    // Check if the product is already in the cart
    const existingProduct = this.products.find(item => item.productName === product.productName);
    if (existingProduct) {
      existingProduct.quantity++;  // If product already exists, increase quantity
    } else {
      this.products.push({ ...product, quantity: 1 }); // Otherwise, add new product with quantity 1
    }

    this.cdr.detectChanges();  // Ensure changes are reflected in the view
  }

  calculateTotal() {
    return this.products.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  proceedToPayment() {
    console.log('Proceeding to payment...');
    this.isPaymentCompleted = true; // Change status to show order summary
  }
}
