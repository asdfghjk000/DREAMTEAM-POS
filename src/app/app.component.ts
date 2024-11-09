import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Import RouterModule for routing
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { CommonModule } from '@angular/common'; // Import CommonModule here
import { routes } from './app.routes'; // Adjust the path as needed
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    FormsModule,  // Add FormsModule here
    CommonModule,
    HttpClientModule // Add CommonModule here
  ],
  template: `<router-outlet></router-outlet>`, // Use template string correctly
  styleUrls: ['./app.component.css'] // Correct the property name
})
export class AppComponent {
  title = 'dreamteam-pos';
}
