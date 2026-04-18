import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery = '';

  get username(): string {
    return this.authService.getCurrentUser()?.username || 'User';
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  globalSearch(): void {
    if (!this.searchQuery.trim()) return;
    
    this.router.navigate(['/stock'], { 
      queryParams: { tab: 'products', search: this.searchQuery } 
    }).then(() => {
      this.searchQuery = ''; // Clear after search
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
