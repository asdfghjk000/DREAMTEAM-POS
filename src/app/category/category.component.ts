import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Category {
  main: any;
  categoryID: number;
  categoryName: string;
  categoryMain: string;
  isEditing?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  successMessage: string = '';

closeModal() {
    this.showAddForm = false; // Close Add Category modal
    this.editingCategory = null; // Close Edit Category modal
  }

  openEditForm(category: Category): void {
    this.editingCategory = { ...category }; // Create a copy to avoid direct modification
  }
  
  cancelEditForm(): void {
    this.editingCategory = null; // Reset the editing category
  }
  
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  categoryName: string = '';
  categoryMain: string = '';
  searchText: string = '';
  apiUrl: string = 'http://localhost/backend-db/';
  errorMessage: string = '';
  isLoading: boolean = false;
  showAddForm: boolean = false;
  categoryToDelete: number | undefined;
  showConfirmDialog!: boolean;
category: any;
editingCategory: Category | null = null;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.readCategories();
  }

  toggleAddCategoryForm() {
    this.showAddForm = !this.showAddForm;
  }

  readCategories(): void {
    this.isLoading = true;
    this.http.get<Category[]>(`${this.apiUrl}read_categories.php`).subscribe({
      next: (data) => {
        console.log('Categories received:', data);
        this.categories = data.map((category) => ({
          ...category,
          isEditing: false,
        }));
        this.filterCategories(); // Apply filtering after loading data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error reading categories:', error);
        this.errorMessage = 'Failed to load categories';
        this.isLoading = false;
      },
    });
  }

  onSearchChange(): void {
    this.filterCategories();
  }

  filterCategories(): void {
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredCategories = this.categories.filter(
      (category) =>
        category.categoryName.toLowerCase().includes(searchTextLower) ||
        category.categoryMain.toLowerCase().includes(searchTextLower)
    );
  }

  createCategory(): void {
    // Check if all required fields are filled
    if (!this.categoryName.trim() || !this.categoryMain.trim()) {
      this.errorMessage = 'Category name and category main cannot be empty.';
      return;
    }
  
    // Validate the categoryMain value
    if (this.categoryMain !== 'Food' && this.categoryMain !== 'Drink') {
      this.errorMessage = 'Category main must be either "Food" or "Drink".';
      return;
    }
  
    this.isLoading = true; // Set loading state to true
  
    const postData = {
      categoryName: this.categoryName.trim(),
      categoryMain: this.categoryMain.trim(),
    };
  
    // Make the HTTP POST request to create the category
    this.http
      .post<ApiResponse>(`${this.apiUrl}create_category.php`, postData)
      .subscribe({
        next: (response) => {
          this.isLoading = false; // Reset loading state
  
          if (response.success) {
            // Store the success message in localStorage
            localStorage.setItem(
              'categoryMessage',
              'Category created successfully!'
            );
  
            // Refresh the category list and reset the form
            this.readCategories();
            this.categoryName = '';
            this.categoryMain = '';
            this.errorMessage = '';
            this.showAddForm = false;
  
            // Optionally redirect or reload to show the message
            location.reload();
          } else {
            // Store the error message in localStorage
            localStorage.setItem(
              'categoryMessage',
              response.message || 'Failed to create category.'
            );
            this.errorMessage = response.message || 'Failed to create category.';
          }
        },
        error: (error) => {
          this.isLoading = false; // Reset loading state
  
          // Store the error message in localStorage
          localStorage.setItem(
            'categoryMessage',
            'Error creating category.'
          );
  
          this.errorMessage =
            error.error?.message || 'Error creating category.';
        },
      });
  }
  
  

  enableEditMode(category: Category): void {
    category.isEditing = true;
  }

  cancelEditMode(category: Category): void {
    category.isEditing = false;
  }

  updateCategory(category: Category): void {
    if (!this.editingCategory) return;
  
    this.isLoading = true;
    const postData = {
      categoryID: this.editingCategory.categoryID,
      categoryName: this.editingCategory.categoryName,
      categoryMain: this.editingCategory.categoryMain,
    };
  
    this.http.post<ApiResponse>(`${this.apiUrl}update_category.php`, postData).subscribe({
      next: (response) => {
        console.log('Category updated:', response);
        if (response.success) {
          // Reload categories after update
          this.readCategories();
  
          // Show success message in the admin dashboard
          this.successMessage = 'Category updated successfully!'; // Set success message
  
          // Store success message in localStorage for the admin dashboard to read
          localStorage.setItem('successMessage', this.successMessage);
          location.reload();  
  
          // Automatically clear the message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
            localStorage.removeItem('successMessage'); // Clear message from localStorage
          }, 5000);
  
          // Clear the editing category state
          this.editingCategory = null;
        } else {
          this.errorMessage = response.message || 'Failed to update category';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.errorMessage = 'Failed to update category';
        this.isLoading = false;
      },
    });
  }
  

  deleteCategory(categoryID: number): void {
    if (!categoryID) {
      this.errorMessage = "Category ID is missing.";
      return;
    }
  
    this.categoryToDelete = categoryID;  // Store the category ID for confirmation
    this.showConfirmDialog = true;       // Show the confirmation dialog
  }
  
  confirmDeleteCategory(): void {
    if (!this.categoryToDelete) return;
  
    this.isLoading = true;
  
    this.http
      .get<ApiResponse>(`${this.apiUrl}delete_category.php?id=${this.categoryToDelete}`)
      .subscribe({
        next: (response) => {
          console.log('Category deleted:', response);
          if (response.success) {
            // Reload categories after deletion
            this.readCategories();
  
            // Show success message in the admin dashboard
            this.successMessage = 'Category deleted successfully!'; // Set success message
  
            // Store success message in localStorage for the admin dashboard to read
            localStorage.setItem('successMessage', this.successMessage);
            location.reload();  
  
            // Automatically clear the message after 5 seconds
            setTimeout(() => {
              this.successMessage = '';
              localStorage.removeItem('successMessage'); // Clear message from localStorage
            }, 5000);
          } else {
            this.errorMessage = response.message || 'Failed to delete category';
          }
          this.isLoading = false;
          this.showConfirmDialog = false; // Hide the confirmation dialog
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.errorMessage = 'Failed to delete category';
          this.isLoading = false;
          this.showConfirmDialog = false; // Hide the confirmation dialog
        },
      });
  }
  
  
  cancelDeleteCategory(): void {
    this.showConfirmDialog = false; // Hide the confirmation dialog if canceled
  }
  
}
