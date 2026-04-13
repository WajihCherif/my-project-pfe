import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'home', canActivate: [AuthGuard], loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'stock', canActivate: [AuthGuard], loadComponent: () => import('./pages/stock/stock.component').then(m => m.StockComponent) },
  { path: 'alerts', canActivate: [AuthGuard], loadComponent: () => import('./pages/alerts/alerts.component').then(m => m.AlertsComponent) },
  { path: 'etat', canActivate: [AuthGuard], loadComponent: () => import('./pages/etat/etat.component').then(m => m.EtatComponent) },
  { path: 'live-camera', canActivate: [AuthGuard], loadComponent: () => import('./pages/live-camera/live-camera.component').then(m => m.LiveCameraComponent) },
  { path: 'account', canActivate: [AuthGuard], loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent) },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
