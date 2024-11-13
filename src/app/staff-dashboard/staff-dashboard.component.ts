import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatMenuModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent {
  currentCategory: string = 'allitems';  // Default to 'allitems'
  currentSubCategory: string | null = null;  // No subcategory by default

  // Method to change the main category
  changeContent(category: string): void {
    this.currentCategory = category;
    // Reset subcategory when changing main category
    if (category !== 'allitems') {
      this.currentSubCategory = null;
    }
  }

  // Method to change the subcategory under 'allitems'
  changeSubCategory(subCategory: string): void {
    this.currentSubCategory = subCategory;
  }
}
