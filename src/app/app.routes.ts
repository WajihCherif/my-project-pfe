import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LiveCameraComponent } from './pages/live-camera/live-camera.component';
import { StockComponent } from './pages/stock/stock.component';
import { EtatComponent } from './pages/etat/etat.component';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { AccountComponent } from './pages/account/account.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'live-camera', component: LiveCameraComponent },
  { path: 'stock', component: StockComponent },
  { path: 'etat', component: EtatComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: 'account', component: AccountComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }