import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AllItemsComponent } from '../all-items/all-items.component';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatMenuModule, AllItemsComponent],
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent {
  currentCategory: string = 'allItems';  // Default to 'allItems'
  currentSubCategory: string | null = null;  // No subcategory by default

  // Method to change the main category
  changeContent(category: string): void {
    this.currentCategory = category;
    // Reset subcategory when changing main category
    if (category !== 'allItems') {
      this.currentSubCategory = null;
    }
  }

  // Method to change the subcategory under 'allItems'
  changeSubCategory(subCategory: string): void {
    this.currentSubCategory = subCategory;
  }
}
