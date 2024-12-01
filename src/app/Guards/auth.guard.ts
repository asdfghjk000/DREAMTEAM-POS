// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole(); // Retrieve role from service or localStorage
    console.log('AuthGuard: Checking if user is logged in. Role:', role);
  
    if (role) {
      return true;  // User is logged in
    } else {
      this.router.navigate(['/main']);
      console.log('AuthGuard: User is not logged in, redirecting to /main');
      return false;
    }
  }
}
