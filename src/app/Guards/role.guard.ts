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
    const role = this.authService.getRole();
    console.log('Retrieved role from localStorage:', role);  // Log the retrieved role
    const expectedRole = route.data['role'];
  
    if (role === expectedRole) {
      return true;
    } else {
      console.warn('Unauthorized access attempt detected. Redirecting...');
      this.router.navigate(['/unauthorized'], { skipLocationChange: true });
      return false;
    }
  }
}