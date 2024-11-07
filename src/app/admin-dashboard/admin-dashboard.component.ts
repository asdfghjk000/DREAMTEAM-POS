import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';  // Add this
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf, ngFor, etc.
import { Inject } from '@angular/core';  // Add this import


import { NewProductDialog } from './new-product-dialog.component';  // Ensure correct path

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent {
  changeContent() {
    // Your logic here
  }

  constructor(public dialog: MatDialog) {}

  openNewProductDialog() {
    const dialogRef = this.dialog.open(NewProductDialog, {
      data: { product: {} }  // Pass the data you want to inject
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Product saved:', result);
      }
    });
  }
}