import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewOrderComponent } from '../new-order/new-order.component';
import { Product, ApiResponse } from '../products/products.component';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {
  selectedCategory: string | null = null;

  // Filter products by selected category
  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.categoryName === category);
  }

  // Handle category click
  onCategoryClick(category: string): void {
    this.selectedCategory = category;
    this.filteredProducts = this.getProductsByCategory(category); // Update filtered products based on the selected category
  }

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
  isOrderSummaryVisible: boolean = true;  // Flag to control visibility of order summary
  searchQuery: string = ''; // Search input

  constructor(private http: HttpClient) {}

  // Method to update order in the parent component
  handleUpdatedOrder(updatedProducts: Product[]): void {
    this.products = updatedProducts;
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

  // Method to get a list of all unique category names
  CategoryNameList(): string[] {
    // Use a Set to ensure uniqueness
    const uniqueCategories = new Set(this.products.map(product => product.categoryName));
    return Array.from(uniqueCategories); // Convert the Set back to an array
  }

  // Fetch products from the API
  fetchProducts(): void {
    this.isLoading = true;
    this.http.get<ApiResponse>(`${this.apiUrl}read_products.php`).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          // Filter the products where categoryMain is "food"
          this.products = response.data.filter((product: Product) => 
            product.categoryMain && product.categoryMain.toLowerCase() === 'food'
          );

          this.filteredProducts = this.products; // Initialize filteredProducts with all products

          // Set the first category as the selected category by default
          const categories = this.CategoryNameList();
          if (categories.length > 0) {
            this.selectedCategory = categories[0]; // Set the first category as selected
            this.filteredProducts = this.getProductsByCategory(this.selectedCategory); // Filter products by the first category
          }
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
