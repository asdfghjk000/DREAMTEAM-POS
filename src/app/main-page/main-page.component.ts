import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- Import RouterModule

@Component({
  selector: 'app-main-page',
  standalone: true, // <-- Standalone component
  imports: [RouterModule], // <-- Import RouterModule here
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  title = 'esher-cafe'
}
