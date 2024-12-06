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
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})

export class CategoryListComponent implements OnInit {
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
    if (this.categoryName.trim() && this.categoryMain.trim()) {
      if (this.categoryMain !== 'Food' && this.categoryMain !== 'Drink') {
        this.errorMessage = 'Category main must be either "Food" or "Drink".';
      } else {
        this.isLoading = true;
        const postData = {
          categoryName: this.categoryName,
          categoryMain: this.categoryMain,
        };

        this.http
          .post<ApiResponse>(`${this.apiUrl}create_category.php`, postData)
          .subscribe({
            next: (response) => {
              console.log('Category created:', response);
              if (response.success) {
                this.readCategories();
                this.categoryName = '';
                this.categoryMain = '';
                this.errorMessage = '';
                this.showAddForm = false;
              } else {
                this.errorMessage =
                  response.message || 'Failed to create category';
              }
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error creating category:', error);
              this.errorMessage = 'Failed to create category';
              this.isLoading = false;
            },
          });
      }
    } else {
      this.errorMessage = 'Category name and category main cannot be empty';
    }
  }

  enableEditMode(category: Category): void {
    category.isEditing = true;
  }

  cancelEditMode(category: Category): void {
    category.isEditing = false;
  }

  updateCategory(category: Category): void {
    if (!category.isEditing) return;
    this.isLoading = true;
    const postData = {
      categoryID: category.categoryID,
      categoryName: category.categoryName,
      categoryMain: category.categoryMain,
    };

    this.http
      .post<ApiResponse>(`${this.apiUrl}update_category.php`, postData)
      .subscribe({
        next: (response) => {
          console.log('Category updated:', response);
          if (response.success) {
            this.readCategories();
          } else {
            this.errorMessage =
              response.message || 'Failed to update category';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.errorMessage = 'Failed to update category';
          this.isLoading = false;
        },
      });
    category.isEditing = false;
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
            this.readCategories();  // Reload categories after deletion
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
