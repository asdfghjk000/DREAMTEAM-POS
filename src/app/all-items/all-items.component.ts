import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, ApiResponse } from '../products/products.component';  // Assuming 'Product' and 'ApiResponse' are defined in 'products.component.ts'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewOrderComponent } from "../new-order/new-order.component";

@Component({
  selector: 'app-all-items',
  standalone: true,
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css'],
  imports: [FormsModule, CommonModule],
})
export class AllItemsComponent implements OnInit {

// Method to handle search input and filter products
  onSearchQueryChange(): void {
    if (this.searchQuery) {
      this.filteredProducts = this.products.filter(product => 
        product.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products];  // Reset to all products if search query is empty
    }
  }

  @Output() selectProduct = new EventEmitter<Product>();  // Emitting Product type
  products: Product[] = [];
  filteredProducts: Product[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  apiUrl: string = 'http://localhost/backend-db/';  // Replace with your backend URL
  selectedProducts: any[] = [];
  currentOrder: any[] = [];
  isOrderSummaryVisible: boolean = false;  // Flag to control visibility of order summary
  searchQuery: string = ''; // Search input

  constructor(private http: HttpClient) {}

  // Method to update order in the parent component
  updateOrder(updatedProducts: Product[]): void {
    this.products = updatedProducts; // Update the shared state when order changes
  }

  // Handle cancel order logic
  handleCancelOrder(): void {
    this.products = []; // Reset products if order is canceled
    this.isOrderSummaryVisible = false; // Hide the order summary
  }

  // Handle confirm order logic
  handleConfirmOrder(): void {
    console.log('Order confirmed');
    this.handleOrderClosed();
  }

  // Handle order closed logic
  handleOrderClosed(): void {
    console.log('Order successfully closed');
    this.refreshDashboard(); // Refresh the dashboard and reset state after closing the order
  }

  // Refresh the dashboard and reset the products state after order is closed
  refreshDashboard(): void {
    console.log('Order closed, refreshing dashboard...');
    this.fetchProducts();  // Re-fetch products or reset the order state
    this.products = [];    // Clear the products from the dashboard after the order is closed
  }

  // Method to select a product and add it to the current order
  selectAndEmitProducts(product: Product): void {
    const exists = this.currentOrder.some(p => p.id === product.id);
    if (!exists) {
      this.currentOrder.push(product);  // Add the product to the current order
    }
    this.selectProduct.emit(product);  // Emits the selected product
  }

  // Method to handle the new order received from the NewOrderComponent
  handleNewOrder(order: any[]): void {
    if (order.length > 0) {
      this.currentOrder = order; // Store the order
      this.isOrderSummaryVisible = true; // Show the order summary
    } else {
      this.errorMessage = 'No products selected!';
    }
  }

  ngOnInit(): void {
    this.fetchProducts(); // Fetch products on initialization
  }

  // Fetch products from the API
  fetchProducts(): void {
    this.isLoading = true;
    this.http.get<ApiResponse>(`${this.apiUrl}read_products.php`).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.products = response.data;
          this.filteredProducts = this.products; // Initialize filteredProducts with all products
        } else {
          this.errorMessage = response.message || 'No products found.';
          this.products = []; // Clear products if none are found
          this.filteredProducts = [];
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load products.';
        this.isLoading = false;
      },
    });
  }

  // Method to filter products based on search query
  onSearch(): void {
    if (this.searchQuery) {
      this.filteredProducts = this.products.filter(product => 
        product.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; // Reset to all products when search is cleared
    }
  }

  // On select product, emit the selected product
  onSelectProduct(product: Product): void {
    this.selectAndEmitProducts(product);  // Call the renamed method here
  }
}
