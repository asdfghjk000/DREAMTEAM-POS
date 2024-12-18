// app.routes.ts
import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { UsersComponent } from './users/users.component';
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
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { ReportsComponent } from './reports/reports.component';
import { UnauthorizedComponent } from './Unauthorized/dreamteam-pos/src/app/unauthorized/unauthorized.component';
import { AboutComponent } from './about/about.component';
import { ModalComponent } from './modal/modal.component';


export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent },
  { path: 'staff-dashboard', component: StaffDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'} },
  { path: 'super-admin', component: SuperAdminComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'superadmin'}},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'superadmin'}},
  { path: 'all-items', component: AllItemsComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'foods', component: FoodsComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'modal', component: ModalComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'drinks', component: DrinksComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'new-order', component: NewOrderComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'payment-process', component: PaymentProcessComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'} },
  { path: 'product', component: ProductsComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'} },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'} },
  { path: 'order-summary', component: OrderSummaryComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'staff'} },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'} },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'} },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '/main' } // Wildcard route should be last
];


export class AppRoutingModule {}
export { RoleGuard };