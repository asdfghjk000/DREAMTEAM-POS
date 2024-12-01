import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.authService.getRole(); // Get role from localStorage
    const expectedRole = route.data['role']; // Get the expected role for the route

    // Check if user is logged in
    if (!role) {
      this.showUnauthorizedAccess();
      return false;
    }

    // Check if user role matches the expected role for the route
    if (role === expectedRole) {
      return true; // Allow access if role matches
    } else {
      this.showUnauthorizedAccess();
      return false; // Prevent access
    }
  }

  // Show Unauthorized Access snackbar and handle dismissal
  private showUnauthorizedAccess() {
    const snackBarRef = this.snackBar.open('Unauthorized Access', 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['unauthorized-snackbar'] // Optional: Add a custom class for styling
    });

    // Listen for when the snackbar is dismissed (only when the user clicks "Close")
    snackBarRef.onAction().subscribe(() => {
      // Redirect to main page only after user clicks "Close"
      this.router.navigate(['/main']);
    });
  }
}
