import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from '../category/category.component';
import { ProductsComponent } from "../products/products.component";
import { OrderHistoryComponent } from "../order-history/order-history.component";
import { SalesComponent } from "../sales/sales.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatMenuModule, CategoryComponent, ProductsComponent, OrderHistoryComponent, OrderHistoryComponent, SalesComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements AfterViewInit {
  // Existing properties
  currentCategory: string = 'sales'; // Default category
  currentSubCategory: string | null = null; // No subcategory by default
  isCategoryFormVisible: boolean = false; // Control visibility of the category form
  categoryName: string = ''; // Form input for category name
  mainCategory: string = ''; // Form input for main category (Food or Drink)
  errorMessage: string = ''; // Error message for form validation
  categories: { categoryCode: string; categoryName: string; mainCategory: string }[] = []; // Array to hold categories
  editingIndex: number | null = null; // Track which category is being edited

  // Product form properties
  products: { imageUrl: string; productCode: string; productName: string; category: string; price: number }[] = []; // Array to hold products
  isProductFormVisible: boolean = false; // Control visibility of the product form
  imageUrl: string = ''; // Form input for image URL
  productCode: string = ''; // Form input for product code
  productName: string = ''; // Form input for product name
  productCategory: string = ''; // Form input for product category
  productPrice: number = 0; // Form input for product price
  editingProductIndex: number | null = null; // Track which product is being edited
  productErrorMessage: string = ''; // Error message for product form validation

  // Toggle category form visibility
  toggleCategoryForm(): void {
    this.isCategoryFormVisible = !this.isCategoryFormVisible;
    if (!this.isCategoryFormVisible) {
      this.categoryName = '';
      this.mainCategory = '';
      this.editingIndex = null;
    }
  }

  // Toggle product form visibility
  toggleProductForm(): void {
    this.isProductFormVisible = !this.isProductFormVisible;
    if (!this.isProductFormVisible) {
    }
  }

  

  // Create or update category
  createCategory(): void {
    if (this.categoryName.trim() && this.mainCategory.trim()) {
      const categoryCode = this.generateCategoryCode();
      if (this.editingIndex !== null) {
        this.categories[this.editingIndex] = {
          categoryCode,
          categoryName: this.categoryName,
          mainCategory: this.mainCategory
        };
      } else {
        const newCategory = { categoryCode, categoryName: this.categoryName, mainCategory: this.mainCategory };
        this.categories.push(newCategory);
      }
      this.categoryName = '';
      this.mainCategory = '';
      this.errorMessage = '';
      this.isCategoryFormVisible = false;
      this.editingIndex = null;
    } else {
      this.errorMessage = 'Please fill in both fields.';
    }
  }

  // Delete category
  deleteCategory(index: number): void {
    this.categories.splice(index, 1);
  }

  // Edit category
  editCategory(index: number): void {
    const categoryToEdit = this.categories[index];
    this.categoryName = categoryToEdit.categoryName;
    this.mainCategory = categoryToEdit.mainCategory;
    this.editingIndex = index;
    this.isCategoryFormVisible = true;
  }
// Change main category
changeContent(category: string): void {
  this.currentCategory = category;

  // Set default subcategory when "products" is clicked
  if (category === 'products') {
    this.currentSubCategory = 'category'; // Set the default subcategory as 'category'
  } else {
    this.currentSubCategory = null; // Reset subcategory if not 'products'
  }
}



  // Change subcategory
  changeSubCategory(subCategory: string): void {
    this.currentSubCategory = subCategory;
  }

  // Generate category code
  generateCategoryCode(): string {
    const codeLength = 3;
    const lastCategory = this.categories[this.categories.length - 1];
    const newCodeNumber = lastCategory ? parseInt(lastCategory.categoryCode) + 1 : 1;
    return newCodeNumber.toString().padStart(codeLength, '0');
  }

  // Create or update product
createProduct(): void {
  if (this.productName.trim() && this.productCategory.trim() && this.productPrice > 0) {
    const newProduct = {
      imageUrl: this.imageUrl || 'assets/product-image.png',
      productCode: this.generateProductCode(), // Automatically generated if not provided
      productName: this.productName,
      category: this.productCategory,
      price: this.productPrice
    };

    if (this.editingProductIndex !== null) {
      this.products[this.editingProductIndex] = newProduct;
    } else {
      this.products.push(newProduct);
    }

    this.isProductFormVisible = false;
    this.productErrorMessage = '';
  } else {
    this.productErrorMessage = 'Please fill in all product fields except for the product code.';
  }
}


  // Edit product
  editProduct(index: number): void {
    const productToEdit = this.products[index];
    this.imageUrl = productToEdit.imageUrl;
    this.productCode = productToEdit.productCode;
    this.productName = productToEdit.productName;
    this.productCategory = productToEdit.category;
    this.productPrice = productToEdit.price;
    this.editingProductIndex = index;
    this.isProductFormVisible = true;
  }

  // Delete product
  deleteProduct(index: number): void {
    this.products.splice(index, 1);
  }

  // Generate product code starting with 'A1'
  generateProductCode(): string {
    const codePrefix = 'A';
    const productCount = this.products.length + 1;
    return `${codePrefix}${productCount}`;
  }

  // Drag functionality
  ngAfterViewInit() {
    const form = document.querySelector('.category-form') as HTMLElement;
    const header = form?.querySelector('h3') as HTMLElement;
    let offsetX: number, offsetY: number;

    if (form && header) {
      header.addEventListener('mousedown', (e: MouseEvent) => {
        offsetX = e.clientX - form.getBoundingClientRect().left;
        offsetY = e.clientY - form.getBoundingClientRect().top;

        const onMouseMove = (moveEvent: MouseEvent) => {
          form.style.left = `${moveEvent.clientX - offsetX}px`;
          form.style.top = `${moveEvent.clientY - offsetY}px`;
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  }
}
