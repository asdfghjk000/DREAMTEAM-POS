import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewOrderComponent } from '../new-order/new-order.component';
import { Product, ApiResponse } from '../products/products.component';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [FormsModule, CommonModule, NewOrderComponent],
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {
  @Output() selectProduct = new EventEmitter<Product>();  // Emitting Product type
  products: Product[] = [];
  filteredProducts: Product[] = [];  // To store filtered products
  errorMessage: string = '';
  isLoading: boolean = false;
  apiUrl: string = 'http://localhost/backend-db/';
  selectedProducts: any[] = [];
  currentOrder: any[] = [];
  searchQuery: string = '';  // To bind the search input field

  constructor(private http: HttpClient) {}

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

  // Rename selectProducts method to avoid confusion
  selectAndEmitProducts(product: Product): void {
    this.selectProduct.emit(product);  // Emits the selected product
  }

  // Method to handle the new order received from the DrinksComponent
  handleNewOrder(order: any[]): void {
    if (order.length > 0) {
      this.currentOrder = order; // Store the order
    } else {
      this.errorMessage = 'No products selected!';
    }
  }

  ngOnInit(): void {
    this.fetchProducts(); // Fetch products on initialization
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.http.get<ApiResponse>(`${this.apiUrl}read_products.php`).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          // Filter the products where categoryMain is "food"
          this.products = response.data.filter((product: Product) => 
            product.categoryMain && product.categoryMain.toLowerCase() === 'food'
          );
          this.filteredProducts = [...this.products];  // Initialize filtered products with all products
        } else {
          this.errorMessage = response.message || 'No products found.';
          this.products = []; // Clear products if none are found
          this.filteredProducts = [];  // Clear filtered products
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load products.';
        this.isLoading = false;
      },
    });
  }

  onSelectProduct(product: Product): void {
    this.selectAndEmitProducts(product);  // Call the renamed method here
  }
}
