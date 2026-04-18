import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EtagereService } from '../../../core/services/etagere.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  alertCount = 0;
  dashboardCount = 0;

  constructor(
    private auth: AuthService,
    private etagereService: EtagereService
  ) {}

  ngOnInit() {
    this.loadCounts();
  }

  loadCounts() {
    this.etagereService.getAll().subscribe({
      next: (etageres) => {
        // Calculate alerts (low stock or empty)
        this.alertCount = etageres.filter(e => 
          !e.quantity_etagere || (e.max_capacity && (e.quantity_etagere / e.max_capacity) <= 0.2)
        ).length;
        
        // Simulating dashboard count for aesthetic
        this.dashboardCount = 1; 
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
