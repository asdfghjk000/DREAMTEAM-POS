import { Component } from '@angular/core';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css']
})
export class AllItemsComponent {
  currentCategory: string = 'allitems';  // Default to 'allitems'

  // Method to change the current category based on the clicked item
  changeContent(category: string): void {
    this.currentCategory = category;
  }
}
