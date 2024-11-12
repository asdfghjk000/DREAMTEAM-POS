import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Product {
  productID: number;
  categoryName: string;
  productName: string;
  price: number;
  image?: string; // Base64 encoded image string
  isEditing?: boolean; // New property to track edit mode
  selectedImage?: Blob | undefined; // Add selectedImage to the Product interface
}

interface Category {
  categoryID: number;
  categoryName: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Product | Product[]; // Allow data to be a single Product or an array
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = []; // Added to hold category data
  newProduct: Partial<Product> = {};
  selectedImage: Blob | null = null;
  apiUrl: string = 'http://localhost/backend-db/';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.readProducts();
    this.readCategories(); // Fetch categories on initialization
  }

  readProducts(): void {
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

  readCategories(): void {
    this.isLoading = true;
    this.http.get<Category[]>(`${this.apiUrl}read_categories.php`).subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load categories';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event, product?: Product): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (file.type.startsWith('image/')) {
        if (file.size > 2 * 1024 * 1024) { // 2MB size limit
          this.errorMessage = 'The image file is too large. Please select an image under 2MB.';
          return;
        }

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          if (reader.result) {
            const imageBlob = new Blob([reader.result], { type: file.type });

            if (product) {
              product.image = URL.createObjectURL(imageBlob); // Image preview
              product.selectedImage = imageBlob; // Assign selected image to the product
            } else {
              this.selectedImage = imageBlob;
            }
          }
        };
      } else {
        this.errorMessage = 'Please select a valid image file (PNG, JPEG, etc.)';
      }
    }
  }

  createProduct(): void {
    if (this.newProduct.productName && this.newProduct.categoryName && this.newProduct.price !== undefined) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('productName', this.newProduct.productName!);
      formData.append('categoryName', this.newProduct.categoryName!);
      formData.append('price', this.newProduct.price!.toString());

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.http.post<ApiResponse>(`${this.apiUrl}create_product.php`, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.readProducts(); // Refresh product list after creating
            this.newProduct = {};
            this.selectedImage = null;

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          } else {
            this.errorMessage = response.message || 'Failed to create product';
          }
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Failed to create product';
          this.isLoading = false;
        }
      });
    }
  }

  enableEdit(product: Product): void {
    product.isEditing = true;
  }

  cancelEdit(product: Product): void {
    product.isEditing = false;
    this.readProducts(); // Reload to revert any unsaved changes
  }

  updateProduct(product: Product): void {
    if (!product.productName || !product.categoryName || product.price === undefined) {
      this.errorMessage = 'All fields are required for updating a product';
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('productID', product.productID.toString());
    formData.append('productName', product.productName);
    formData.append('categoryName', product.categoryName);
    formData.append('price', product.price.toString());

    if (product.selectedImage) {
      formData.append('image', product.selectedImage);
    }

    this.http.post<ApiResponse>(`${this.apiUrl}update_product.php`, formData).subscribe({
      next: (response) => {
        if (response.success) {
          product.isEditing = false; // Exit edit mode after a successful update
          this.readProducts(); // Refresh product list
        }
        this.errorMessage = response.message || 'Failed to update product';
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Failed to update product';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(productID: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;

      this.http.delete<ApiResponse>(`${this.apiUrl}delete_product.php?productID=${productID}`).subscribe({
        next: (response) => {
          if (response.success) {
            this.readProducts(); // Refresh product list after deleting
          } else {
            this.errorMessage = response.message || 'Failed to delete product';
          }
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Failed to delete product';
          this.isLoading = false;
        }
      });
    }
  }
}
