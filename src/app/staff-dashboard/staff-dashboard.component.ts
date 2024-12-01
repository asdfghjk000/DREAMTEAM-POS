import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AllItemsComponent } from '../all-items/all-items.component';
import { FoodsComponent } from "../foods/foods.component";
import { DrinksComponent } from "../drinks/drinks.component";
import { NewOrderComponent } from '../new-order/new-order.component';
import { Product } from '../products/products.component';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatMenuModule, AllItemsComponent, FoodsComponent, DrinksComponent, NewOrderComponent],
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent {
  currentCategory: string = 'allItems'; // Default to 'allItems'
  selectedProducts: any[] = [];  // Track selected products
  currentOrder: any[] = [];
  errorMessage!: string;
  isOrderConfirmed: boolean = false;  // Track if the order is confirmed
  showOrderComponents: boolean = true; // Show/Hide New Order and Summary
  orderProducts: Product[] = []; // Store products for new order

  // Method to change the main category
  changeContent(category: string): void {
    this.currentCategory = category;
  }

  // Close the order components after confirmation
  closeOrderComponents() {
    this.showOrderComponents = false;
  }

  // Restore the New Order data
  restoreNewOrder(products: Product[]) {
    this.orderProducts = products; // Set the products back
    this.showOrderComponents = true; // Show the components again
  }

  // Method to handle product selection in AllItems, Foods, Drinks
  selectProduct(product: any): void {
    const existingProduct = this.selectedProducts.find(p => p.productName === product.productName);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      this.selectedProducts.push({ ...product, quantity: 1 });
    }
  }

  // Method to handle new order received from DrinksComponent or AllItemsComponent
  handleNewOrder(order: any[]): void {
    if (order.length > 0) {
      this.currentOrder = order; // Store the new order
    } else {
      this.errorMessage = 'No products selected!';
    }
  }

  // Handle the order confirmation event
  onOrderConfirmed(): void {
    this.isOrderConfirmed = true;
    this.selectedProducts = [];  // Clear the selected products after confirming
  }
}
