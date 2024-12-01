import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Product {
  id: any;
  status: string;  // Status can be "Enable" or "Disable"
  isEnabled: boolean;  // A boolean for the status that determines if the product is active or not
  quantity: number;
  categoryMain: string;
  productID: number;
  categoryName: string;
  productName: string;
  price: number;
  image?: string;  // Image file name or URL (optional)
  isEditing?: boolean;  // Whether the product is being edited (optional)
  imageUrl?: string;  // URL of the image (optional)
  selectedImage?: Blob;  // File object for the selected image (optional)
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
  filteredProducts: Product[] = []; // Filtered list for displaying in the table
  searchQuery: string = ''; // Search query string


editProduct(_t82: Product) {
throw new Error('Method not implemented.');
}  
  
  products: Product[] = [];
  categories: Category[] = [];
  newProduct: Partial<Product> = { 
  };
  selectedImage: Blob | null = null;
  apiUrl: string = 'http://localhost/backend-db/';
  errorMessage: string = '';
  isLoading: boolean = false;
  showAddForm: boolean = false;

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
          this.filteredProducts = this.products; // Initialize filtered list
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
  filterProducts(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      product.productName.toLowerCase().includes(query)
    );
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
  
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file (PNG, JPEG, etc.)';
        return;
      }
  
      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'The image file is too large. Please select an image under 2MB.';
        return;
      }
  
      this.errorMessage = ''; // Clear error message if file is valid
  
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.readAsArrayBuffer(file); // Use ArrayBuffer for Blob conversion
      reader.onload = () => {
        if (reader.result) {
          const imageBlob = new Blob([reader.result], { type: file.type });
          const imageUrl = URL.createObjectURL(imageBlob); // Temporary URL for preview
  
          // Manage image URL and Blob depending on whether we're creating or updating a product
          if (product) {
            if (product.imageUrl) {
              URL.revokeObjectURL(product.imageUrl); // Revoke the previous preview URL to avoid memory leak
            }
            product.imageUrl = imageUrl; // Temporary preview URL for the image
            product.selectedImage = imageBlob; // Blob to be sent in the API request
          } else {
            this.selectedImage = imageBlob; // If creating a new product, store the preview and image Blob
          }
        }
      };
    }
  }  

  createProduct(): void {
    // Check if all required fields are filled
    if (!this.newProduct.productName || !this.newProduct.categoryName || this.newProduct.price === undefined || !this.newProduct.status) {
      this.errorMessage = 'All fields are required.';
      return;
    }
  
    // Check if the price is a positive number
    if (this.newProduct.price <= 0) {
      this.errorMessage = 'Price must be a positive number.';
      return;
    }
  
    // Ensure that statusText is correctly set as "Enable" or "Disable" based on the selected value
    this.newProduct.isEnabled = this.newProduct.status === 'Available';
  
    this.isLoading = true; // Set loading state to true
    const formData = new FormData();
  
    // Append product details to form data
    formData.append('productName', this.newProduct.productName!);
    formData.append('categoryName', this.newProduct.categoryName!);
    formData.append('price', this.newProduct.price.toString());
    formData.append('status', this.newProduct.status); // Send statusText ("Enable" or "Disable")
  
    // If there's a selected image, append it to the form data
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    // Make the HTTP POST request to create the product
    this.http.post<ApiResponse>(`${this.apiUrl}create_product.php`, formData).subscribe({
      next: (response) => {
        // If the response indicates success, refresh the product list and hide the form
        if (response.success) {
          this.readProducts(); // Reload products
          this.toggleAddProductForm(); // Hide the form
        } else {
          this.errorMessage = response.message || 'Failed to create product.';
        }
        this.isLoading = false; // Reset loading state
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error creating product.';
        this.isLoading = false; // Reset loading state
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
    // Validate required fields
    if (!product.productName || !product.categoryName || product.price === undefined || !product.status) {
      this.errorMessage = 'All fields are required for updating a product';
      return;
    }
  
    // Validate price to be a positive number
    if (product.price <= 0) {
      this.errorMessage = 'Price must be a positive number.';
      return;
    }
  
    // Ensure the selected status is correctly updated
    product.isEnabled = product.status === 'Available';
  
    this.isLoading = true;  // Set loading state to true
  
    // Prepare form data to send in the request
    const formData = new FormData();
    formData.append('productID', product.productID.toString());
    formData.append('productName', product.productName);
    formData.append('categoryName', product.categoryName);
    formData.append('price', product.price.toString());
    formData.append('status', product.status); // Send the updated status as "Enable" or "Disable"
  
    // Append the selected image if available
    if (product.selectedImage) {
      formData.append('image', product.selectedImage);
    }
  
    // Make the HTTP POST request to update the product
    this.http.post<ApiResponse>(`${this.apiUrl}update_product.php`, formData).subscribe({
      next: (response) => {
        if (response.success) {
          product.isEditing = false; // Close the edit form
          this.readProducts(); // Refresh the product list
          this.resetForm(); // Reset the newProduct form and selected image
          this.errorMessage = ''; // Clear any existing error messages
        } else {
          this.errorMessage = response.message || 'Failed to update product';
        }
        this.isLoading = false;  // Reset loading state
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to update product';
        this.isLoading = false;  // Reset loading state
      }
    });
  }
  
  
  // Reset the form and image after successful update
  private resetForm(): void {
    this.newProduct = {};  // Reset the newProduct form
    this.selectedImage = null;  // Reset the selected image
  }
  

  deleteProduct(productID: number): void {
    if (!productID) {
      this.errorMessage = "Product ID is missing.";
      return;
    }
  
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