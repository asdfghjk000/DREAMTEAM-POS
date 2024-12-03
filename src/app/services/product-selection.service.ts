import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductSelectionService {
  private selectedProductsSource = new BehaviorSubject<any[]>([]); // Hold the selected products
  selectedProducts$ = this.selectedProductsSource.asObservable();  // Observable to share the selected products

  // Method to add or update product in the selected list
  addProduct(product: any): void {
    const products = this.selectedProductsSource.value;
    const existingProduct = products.find(p => p.productName === product.productName);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      products.push({ ...product, quantity: 1 });
    }

    this.selectedProductsSource.next(products);  // Update the observable
  }

  // Method to remove a product
  removeProduct(product: any): void {
    const products = this.selectedProductsSource.value.filter(p => p.productName !== product.productName);
    this.selectedProductsSource.next(products);  // Update the observable
  }

  // Method to clear all selected products
  clearProducts(): void {
    this.selectedProductsSource.next([]);  // Clear the list
  }
}