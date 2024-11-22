import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Product {
  categoryMain: string;
  productID: number;
  categoryName: string;
  productName: string;
  price: number;
  image?: string; // Base64 encoded image string
  isEditing?: boolean; // New property to track edit mode
  imageUrl?: string;  // This will hold the string URL for image preview
  selectedImage?: Blob;  // This will hold the Blob for uploading the image
}

interface Category {
  categoryID: number;
  categoryName: string;
}

export interface ApiResponse {
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
  showAddForm: boolean = false; // Initialize showAddForm as false

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.readProducts();
    this.readCategories(); // Fetch categories on initialization
  }

  toggleAddProductForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newProduct = {}; // Reset newProduct when form is hidden
      this.errorMessage = ''; // Clear any error messages when toggling form visibility
    }
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
  
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file (PNG, JPEG, etc.)';
        return;
      }
  
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'The image file is too large. Please select an image under 2MB.';
        return;
      }
  
      this.errorMessage = ''; // Clear error message if file is valid
  
      const reader = new FileReader();
      reader.readAsArrayBuffer(file); // Use ArrayBuffer for Blob conversion
      reader.onload = () => {
        if (reader.result) {
          const imageBlob = new Blob([reader.result], { type: file.type });
          const imageUrl = URL.createObjectURL(imageBlob); // Temporary URL for preview
  
          if (product) {
            product.imageUrl = imageUrl; // Temporary preview URL
            product.selectedImage = imageBlob; // Blob for storage
          } else {
            this.selectedImage = imageBlob; // For new product
          }
        }
      };
    }
  }
  

  createProduct(): void {
    if (!this.newProduct.productName || !this.newProduct.categoryName || this.newProduct.price === undefined) {
      this.errorMessage = 'All fields are required.';
      return;
    }
  
    if (this.newProduct.price <= 0) {
      this.errorMessage = 'Price must be a positive number.';
      return;
    }
  
    this.isLoading = true;
    const formData = new FormData();
    formData.append('productName', this.newProduct.productName!);
    formData.append('categoryName', this.newProduct.categoryName!);
    formData.append('price', this.newProduct.price.toString());
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    this.http.post<ApiResponse>(`${this.apiUrl}create_product.php`, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.readProducts();
          this.newProduct = {};  
          this.selectedImage = null;  
          this.errorMessage = '';  
          this.showAddForm = false;  // Close the form after success
  
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
        this.errorMessage = error.error?.message || 'Failed to create product';
        this.isLoading = false;
      }
    });
  }
  

  enableEdit(product: Product): void {
    product.isEditing = true;
  }

  cancelEdit(product: Product): void {
    product.isEditing = false;
    this.readProducts();  
  }

  updateProduct(product: Product): void {
    if (!product.productName || !product.categoryName || product.price === undefined) {
      this.errorMessage = 'All fields are required for updating a product';
      return;
    }

    if (product.price <= 0) {
      this.errorMessage = 'Price must be a positive number.';
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
          product.isEditing = false;  
          this.readProducts();  
        } else {
          this.errorMessage = response.message || 'Failed to update product';
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to update product';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(productID: number): void {
    this.isLoading = true;
    this.http.delete<ApiResponse>(`${this.apiUrl}delete_product.php?productID=${productID}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.readProducts();  // Reload products after deletion
        } else {
          this.errorMessage = response.message || 'Failed to delete product';
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to delete product';
        this.isLoading = false;
      }
    });
  }
  
}