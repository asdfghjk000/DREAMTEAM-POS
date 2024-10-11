import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { StaffLoginComponent } from './staff-login/staff-login.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AllItemsComponent } from './all-items/all-items.component';
import { FoodsComponent } from './foods/foods.component';
import { DrinksComponent } from './drinks/drinks.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { SalesComponent } from './sales/sales.component';
import { ProductsComponent } from './products/products.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'staff-login', component: StaffLoginComponent },
  { path: 'staff-dashboard', component: StaffDashboardComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'all-items', component: AllItemsComponent },
  { path: 'foods', component: FoodsComponent },
  { path: 'drinks', component: DrinksComponent },
  { path: 'new-order', component: NewOrderComponent },
  { path: 'payment-process', component: PaymentProcessComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'order-history', component: OrderHistoryComponent }
];
