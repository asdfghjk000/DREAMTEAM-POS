import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NewOrderComponent implements OnInit {
  @Input() products: any[] = []; // Receive selected products

  ngOnInit() {
    console.log(this.products); // Verify if products are being passed correctly
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(item: any) {
    this.products = this.products.filter(i => i !== item);
  }

  calculateTotal() {
    return this.products.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  proceedToPayment() {
    console.log('Proceeding to payment...');
  }
}
