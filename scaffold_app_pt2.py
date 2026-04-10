import os

files = {
    "src/app/app-routing.module.ts": """
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
""",
    "src/app/app.module.ts": """
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
""",
    "src/app/app.component.ts": """
import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stock Monitoring System';
  constructor(public authService: AuthService) {}
}
""",
    "src/app/app.component.html": """
<div *ngIf="!authService.isLoggedIn()">
  <router-outlet></router-outlet>
</div>
<div *ngIf="authService.isLoggedIn()" class="d-flex flex-column" style="min-height: 100vh;">
  <app-navbar></app-navbar>
  <div class="container-fluid flex-grow-1 d-flex p-0">
    <app-sidebar class="bg-light border-end"></app-sidebar>
    <main class="flex-grow-1 p-4 bg-white" style="min-width: 0;">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
""",
    "src/app/app.component.css": """
:host {
  display: block;
}
""",
    "src/app/shared/components/navbar/navbar.component.ts": """
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  get username(): string {
    return this.authService.getCurrentUser()?.username || 'User';
  }

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
""",
    "src/app/shared/components/navbar/navbar.component.html": """
<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand fw-bold" routerLink="/dashboard">
      <i class="bi bi-box-seam me-2"></i>Stock Monitoring
    </a>
    <div class="d-flex align-items-center">
      <span class="text-white me-3 fw-medium">Welcome, {{ username }}</span>
      <button class="btn btn-light btn-sm fw-bold" (click)="logout()">Logout</button>
    </div>
  </div>
</nav>
""",
    "src/app/shared/components/navbar/navbar.component.css": """
.navbar-brand { font-size: 1.25rem; }
""",
    "src/app/shared/components/sidebar/sidebar.component.ts": """
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {}
""",
    "src/app/shared/components/sidebar/sidebar.component.html": """
<div class="d-flex flex-column p-3" style="width: 250px; min-height: calc(100vh - 56px);">
  <ul class="nav nav-pills flex-column mb-auto">
    <li class="nav-item">
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-link text-dark fw-medium mb-1">Dashboard</a>
    </li>
    <li>
      <a routerLink="/products" routerLinkActive="active" class="nav-link text-dark fw-medium mb-1">Products</a>
    </li>
    <li>
      <a routerLink="/depots" routerLinkActive="active" class="nav-link text-dark fw-medium mb-1">Depots</a>
    </li>
    <li>
      <a routerLink="/etageres" routerLinkActive="active" class="nav-link text-dark fw-medium mb-1">Etageres</a>
    </li>
    <li>
      <a routerLink="/transfer" routerLinkActive="active" class="nav-link text-dark fw-medium mb-1">Transfers</a>
    </li>
    <li>
      <a routerLink="/users" routerLinkActive="active" class="nav-link text-dark fw-medium mb-1">Users</a>
    </li>
  </ul>
</div>
""",
    "src/app/shared/components/sidebar/sidebar.component.css": """
.nav-link.active {
  background-color: #0d6efd !important;
  color: white !important;
}
.nav-link:hover:not(.active) {
  background-color: rgba(13, 110, 253, 0.1);
}
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\\n")

print("Part 2: App configurations, Interceptors, and Layout Components generated.")
