import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Import RouterModule for routing
import { routes } from './app.routes'; // Adjust the path as needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Import RouterModule here
  template: `<router-outlet></router-outlet>`, // Use template string correctly
  styleUrls: ['./app.component.css'] // Correct the property name
})
export class AppComponent {
  title = 'dreamteam-pos';
}
