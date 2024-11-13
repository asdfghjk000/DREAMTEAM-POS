import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatMenuModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  currentCategory: string = 'sales';  // Default to 'allitems'
  currentSubCategory: string | null = null;  // No subcategory by default

  // Method to change the main category
  changeContent(category: string): void {
    this.currentCategory = category;
    // Reset subcategory when changing main category
    if (category !== 'sales') {
      this.currentSubCategory = null;
    }
  }

  // Method to change the subcategory under 'allitems'
  changeSubCategory(subCategory: string): void {
    this.currentSubCategory = subCategory;
  }
}
