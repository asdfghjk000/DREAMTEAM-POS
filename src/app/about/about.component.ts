import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';  // Import the v4 method from the uuid package

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  uniqueId: string;

  constructor() {
    this.uniqueId = '';
  }

  ngOnInit(): void {
    // Check if the UUID is already stored in localStorage
    const storedUUID = localStorage.getItem('appUUID');
    
    // If not, generate a new UUID and store it in localStorage
    if (!storedUUID) {
      this.uniqueId = uuidv4();
      localStorage.setItem('appUUID', this.uniqueId);
    } else {
      // Use the stored UUID
      this.uniqueId = storedUUID;
    }
  }
}
