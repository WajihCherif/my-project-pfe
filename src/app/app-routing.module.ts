import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', canActivate: [AuthGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'products', canActivate: [AuthGuard], loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'products/new', canActivate: [AuthGuard], loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
  { path: 'products/:id', canActivate: [AuthGuard], loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
  { path: 'depots', canActivate: [AuthGuard], loadComponent: () => import('./features/depots/depot-list/depot-list.component').then(m => m.DepotListComponent) },
  { path: 'depots/new', canActivate: [AuthGuard], loadComponent: () => import('./features/depots/depot-form/depot-form.component').then(m => m.DepotFormComponent) },
  { path: 'depots/:id', canActivate: [AuthGuard], loadComponent: () => import('./features/depots/depot-form/depot-form.component').then(m => m.DepotFormComponent) },
  { path: 'etageres', canActivate: [AuthGuard], loadComponent: () => import('./features/etageres/etagere-list/etagere-list.component').then(m => m.EtagereListComponent) },
  { path: 'etageres/new', canActivate: [AuthGuard], loadComponent: () => import('./features/etageres/etagere-form/etagere-form.component').then(m => m.EtagereFormComponent) },
  { path: 'etageres/:id', canActivate: [AuthGuard], loadComponent: () => import('./features/etageres/etagere-form/etagere-form.component').then(m => m.EtagereFormComponent) },
  { path: 'transfer', canActivate: [AuthGuard], loadComponent: () => import('./features/transfer/transfer.component').then(m => m.TransferComponent) },
  { path: 'users', canActivate: [AuthGuard], loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent) },
  { path: 'users/new', canActivate: [AuthGuard], loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: 'users/:id', canActivate: [AuthGuard], loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
