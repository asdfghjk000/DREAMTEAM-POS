// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service.';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole(); // Retrieve role from service or localStorage
    console.log('AuthGuard: Checking if user is logged in. Role:', role);

    if (role) {
      return true; // User is logged in
    } else {
      console.warn('AuthGuard: User not logged in, redirecting...');
      this.router.navigate(['/unauthorized'], { skipLocationChange: true }); // Avoid changing the URL in browser history
      return false; // Prevent access
    }
  }
}