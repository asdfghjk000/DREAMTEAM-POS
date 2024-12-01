// app.routes.ts
import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AllItemsComponent } from './all-items/all-items.component';
import { FoodsComponent } from './foods/foods.component';
import { DrinksComponent } from './drinks/drinks.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { SalesComponent } from './sales/sales.component';
import { ProductsComponent } from './products/products.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { CategoryComponent } from './category/category.component';
import { RoleGuard } from './Guards/role.guard';
import { AuthGuard } from './Guards/auth.guard';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'staff-dashboard', component: StaffDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'} },
  { path: 'all-items', component: AllItemsComponent },
  { path: 'foods', component: FoodsComponent },
  { path: 'drinks', component: DrinksComponent },
  { path: 'new-order', component: NewOrderComponent },
  { path: 'payment-process', component: PaymentProcessComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'category', component: CategoryComponent },
  { path: '**', redirectTo: '/main' } // Wildcard route should be last
];


export class AppRoutingModule {}
export { RoleGuard, MatSnackBarModule };