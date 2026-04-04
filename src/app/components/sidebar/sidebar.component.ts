import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuthPage = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.checkAuthPage(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkAuthPage(event.url);
      });
  }

  private checkAuthPage(url: string) {
    this.isAuthPage = url.includes('/login') || url.includes('/signup');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}