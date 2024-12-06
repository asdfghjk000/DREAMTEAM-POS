// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageReloadService } from './page-reload.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private pageReloadService: PageReloadService) {}

  ngOnInit(): void {
    // Subscribe to the reload event
    this.pageReloadService.reload$.subscribe(() => {
      this.reloadPage();
    });
  }

  reloadPage(): void {
    window.location.reload();  // Reload the page when the event is triggered
  }
}