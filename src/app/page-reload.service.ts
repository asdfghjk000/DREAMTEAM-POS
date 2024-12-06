import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageReloadService {
  private reloadSource = new Subject<void>();  // Create a subject to trigger reload
  reload$ = this.reloadSource.asObservable(); // Observable to subscribe to for reload

  // Method to trigger a reload
  triggerReload(): void {
    this.reloadSource.next();  // Emit reload event
  }
}
