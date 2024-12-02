import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    // Listen to the router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Store the previous URL
        this.previousUrlSubject.next(event.url);
      }
    });
  }

  // Get the last URL
  getPreviousUrl(): string {
    return this.previousUrlSubject.getValue();
  }
}