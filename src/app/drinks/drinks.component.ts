import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  styleUrls: ['./drinks.component.css']
})
export class DrinksComponent implements OnInit {
  @Output() selectProduct = new EventEmitter<Product>(); // Emitting Product type
  products: Product[] = [];
  filteredProducts: Product[] = []; // To store filtered products
  errorMessage: string = '';
  isLoading: boolean = false;
  apiUrl: string = 'http://localhost/backend-db/';
  selectedProducts: any[] = [];
  currentOrder: any[] = [];
  searchQuery: string = ''; // For binding the search input field

  constructor(private http: HttpClient) {}

  // Filter products based on search query
  onSearchQueryChange(): void {
    if (this.searchQuery) {
      this.filteredProducts = this.products.filter(product =>
        product.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products]; // Reset to all products if query is empty
    }
  }

  // Emit the selected product
  selectAndEmitProducts(product: Product): void {
    this.selectProduct.emit(product);
  }

  // Handle new orders received
  handleNewOrder(order: any[]): void {
    if (order.length > 0) {
      this.currentOrder = order; // Store the order
    } else {
      this.errorMessage = 'No products selected!';
    }
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  // Fetch products from the server
  fetchProducts(): void {
    this.isLoading = true;
    this.http.get<ApiResponse>(`${this.apiUrl}read_products.php`).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          // Filter products where categoryMain is "drink"
          this.products = response.data.filter((product: Product) =>
            product.categoryMain && product.categoryMain.toLowerCase() === 'drink'
          );
          this.filteredProducts = [...this.products]; // Initialize filtered products with all products
        } else {
          this.errorMessage = response.message || 'No products found.';
          this.products = [];
          this.filteredProducts = [];
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  onSelectProduct(product: Product): void {
    this.selectAndEmitProducts(product);
  }
}
