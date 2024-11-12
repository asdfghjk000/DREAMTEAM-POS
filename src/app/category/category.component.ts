import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Category {
  categoryID: number;
  categoryName: string;
  isEditing?: boolean; // Add this property to track edit mode
}

interface ApiResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  categoryName: string = '';
  apiUrl: string = 'http://localhost/backend-db/';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.readCategories();
  }

  readCategories(): void {
    this.isLoading = true;
    this.http.get<Category[]>(`${this.apiUrl}read_categories.php`).subscribe({
      next: (data) => {
        console.log('Categories received:', data);
        this.categories = data.map(category => ({
          ...category,
          isEditing: false // Initialize isEditing to false
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error reading categories:', error);
        this.errorMessage = 'Failed to load categories';
        this.isLoading = false;
      }
    });
  }

  createCategory(): void {
    if (this.categoryName.trim()) {
      this.isLoading = true;
      const postData = { categoryName: this.categoryName };
      
      this.http.post<ApiResponse>(`${this.apiUrl}create_category.php`, postData).subscribe({
        next: (response) => {
          console.log('Category created:', response);
          if (response.success) {
            this.readCategories(); // Refresh the categories
            this.categoryName = '';
            this.errorMessage = '';
          } else {
            console.error('Error response from server:', response);
            this.errorMessage = response.message || 'Failed to create category';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating category:', error);
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message; // Display server error message if available
          } else {
            this.errorMessage = 'Failed to create category';
          }
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Category name cannot be empty'; // Provide user feedback
    }
  }
  

  enableEditMode(category: Category): void {
    category.isEditing = true;
  }

  cancelEditMode(category: Category): void {
    category.isEditing = false;
  }

  updateCategory(category: Category): void {
    if (!category.isEditing) return; // Prevent update if not in edit mode
    this.isLoading = true;
    const postData = { 
      categoryID: category.categoryID, 
      categoryName: category.categoryName 
    };

    this.http.post<ApiResponse>(`${this.apiUrl}update_category.php`, postData).subscribe({
      next: (response) => {
        console.log('Category updated:', response);
        if (response.success) {
          this.readCategories();
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Failed to update category';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.errorMessage = 'Failed to update category';
        this.isLoading = false;
      }
    });
    category.isEditing = false; // Disable edit mode after update
  }

  deleteCategory(categoryID: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.isLoading = true;
      this.http.get<ApiResponse>(`${this.apiUrl}delete_category.php?id=${categoryID}`).subscribe({
        next: (response) => {
          console.log('Category deleted:', response);
          if (response.success) {
            this.readCategories();
            this.errorMessage = '';
          } else {
            this.errorMessage = response.message || 'Failed to delete category';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.errorMessage = 'Failed to delete category';
          this.isLoading = false;
        }
      });
    }
  }
}
