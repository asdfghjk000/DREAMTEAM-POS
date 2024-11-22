import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, ApiResponse } from '../products/products.component';
import { NewOrderComponent } from '../new-order/new-order.component';

@Component({
  selector: 'app-drinks',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatMenuModule, NewOrderComponent],
  templateUrl: './drinks.component.html',
  styleUrl: './drinks.component.css'
})
export class DrinksComponent implements OnInit {
  selectedProducts: any[] = []; // Track selected products
  products: Product[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  apiUrl: string = 'http://localhost/backend-db/read_products.php';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchProducts(); // Fetch products on initialization
  }

  // Fetch products from the API
  fetchProducts(): void {
    this.isLoading = true;
    this.http.get<ApiResponse>(this.apiUrl).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          // Filter the products where categoryMain is "Food" (check for null or undefined)
          this.products = response.data.filter((product: Product) => 
            product.categoryMain && product.categoryMain.toLowerCase() === 'drink'
          );
        } else {
          this.errorMessage = response.message || 'No products found.';
          this.products = [];
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load products.';
        this.isLoading = false;
      },
    });
  }
  

  // Handle product selection
  selectProduct(product: Product): void {
    const existingProduct = this.selectedProducts.find(
      (p) => p.productName === product.productName
    );

    if (existingProduct) {
      // If product exists, increase quantity
      existingProduct.quantity++;
    } else {
      // If not, add new product with quantity 1
      this.selectedProducts.push({
        productName: product.productName,
        price: product.price,
        quantity: 1,
      });
    }

    // Trigger change detection to ensure UI is updated
    this.cdr.detectChanges();
  }

  // Remove product from selected items
  removeProduct(item: any): void {
    const index = this.selectedProducts.findIndex(
      (product) => product.productName === item.productName
    );
    if (index !== -1) {
      this.selectedProducts.splice(index, 1); // Remove item by index
    }
    this.cdr.detectChanges(); // Trigger change detection manually
  }
}
