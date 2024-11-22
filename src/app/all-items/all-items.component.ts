import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, ApiResponse } from '../products/products.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewOrderComponent } from '../new-order/new-order.component';

@Component({
  selector: 'app-all-items',
  standalone: true, // Mark the component as standalone
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css'],
  imports: [FormsModule, CommonModule, NewOrderComponent],
})
export class AllItemsComponent implements OnInit {
  selectedProducts: any[] = []; // Track selected products
  products: Product[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  apiUrl: string = 'http://localhost/backend-db/';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchProducts(); // Fetch products on initialization
  }

  // Fetch products from the API
  fetchProducts(): void {
    this.isLoading = true;
    this.http.get<ApiResponse>(`${this.apiUrl}read_products.php`).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.products = response.data as Product[];
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
