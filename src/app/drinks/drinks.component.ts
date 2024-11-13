import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-drinks',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatMenuModule],
  templateUrl: './drinks.component.html',
  styleUrl: './drinks.component.css'
})
export class DrinksComponent {
  currentCategory: string = 'drinks';  // Default to 'allitems'

  // Method to change the current category based on the clicked item
  changeContent(category: string): void {
    this.currentCategory = category;
  }
}
  