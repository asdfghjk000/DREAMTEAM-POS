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
  imports: [FormsModule, CommonModule, NewOrderComponent], // No external components or modules needed for a standalone component
})
export class AllItemsComponent implements OnInit {

  selectedProducts: any[] = []; // Track selected products

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  // Handle selection of a product
  selectProduct(product: Product) {
    const existingProduct = this.selectedProducts.find(p => p.productName === product.productName);
    
    if (existingProduct) {
      // If the product is already selected, increase the quantity
      existingProduct.quantity++;
    } else {
      // Add new product to the order with a quantity of 1
      this.selectedProducts.push({
        productName: product.productName,
        price: product.price,
        quantity: 1
      });
    }

    // Ensure Angular detects the change in the array
    this.cdr.detectChanges();
  }

  products: Product[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  apiUrl: string = 'http://localhost/backend-db/';

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
      }
    });
  }
}
