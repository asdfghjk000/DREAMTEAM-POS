import { MatDialogModule } from '@angular/material/dialog';  // Add this import if not already added
import { NgModule } from '@angular/core';


@NgModule({
  imports: [MatDialogModule,],  // Add this to your module's imports if necessary
  exports: [MatDialogModule]
})
export class AppModule { }

export class NewProductDialog { }