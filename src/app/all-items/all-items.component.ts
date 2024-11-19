import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, ApiResponse } from '../products/products.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-items',
  standalone: true, // Mark the component as standalone
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css'],
  imports: [FormsModule, CommonModule], // No external components or modules needed for a standalone component
})
export class AllItemsComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  apiUrl: string = 'http://localhost/backend-db/'; // Backend URL for API requests

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts(); // Fetch products when component initializes
  }

  // Method to fetch products from the API
  fetchProducts(): void {
    this.isLoading = true; // Show loading indicator
    this.http.get<ApiResponse>(`${this.apiUrl}read_products.php`).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.products = response.data as Product[]; // Populate products array
        } else {
          this.errorMessage = response.message || 'No products found.'; // Error handling if no data
          this.products = [];
        }
        this.isLoading = false; // Stop loading after response
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load products.'; // Handle API error
        this.isLoading = false; // Stop loading after error
      }
    });
  }
}