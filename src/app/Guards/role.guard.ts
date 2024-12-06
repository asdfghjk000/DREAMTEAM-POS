// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service.';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.authService.getRole(); // Get role from localStorage
    const expectedRole = route.data['role']; // Get the expected role for the route

    // Check if user role matches the expected role for the route
    if (role === expectedRole) {
      return true; // Allow access if role matches
    } else {
      console.warn('Unauthorized access attempt detected. Redirecting...');
      this.router.navigate(['/unauthorized'], { skipLocationChange: true }); // Avoid changing the URL in browser history
      return false; // Prevent access
    }
  }
}