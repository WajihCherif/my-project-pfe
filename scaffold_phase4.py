import os

files = {
    # DASHBOARD
    "src/app/features/dashboard/dashboard.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { DepotService } from '../../../core/services/depot.service';
import { EtagereService } from '../../../core/services/etagere.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalDepots = 0;
  totalEtageres = 0;
  totalUsers = 0;
  loading = true;

  constructor(
    private productService: ProductService,
    private depotService: DepotService,
    private etagereService: EtagereService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getAll(),
      depots:   this.depotService.getAll(),
      etageres: this.etagereService.getAll(),
      users:    this.userService.getAll(),
    }).subscribe({
      next: (results) => {
        this.totalProducts = results.products.length;
        this.totalDepots   = results.depots.length;
        this.totalEtageres = results.etageres.length;
        this.totalUsers    = results.users.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.loading = false;
      }
    });
  }
}
""",
    "src/app/features/dashboard/dashboard.component.html": """<div class="container-fluid">
  <h2 class="mb-4 fw-bold text-dark"><i class="bi bi-speedometer2 me-2"></i>Dashboard Overview</h2>
  
  <div *ngIf="loading" class="d-flex justify-content-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div *ngIf="!loading" class="row g-4">
    <div class="col-md-6 col-lg-3">
      <div class="card h-100 shadow-sm border-0 border-start border-primary border-4 rounded-3 card-hover text-center py-4">
        <div class="card-body">
          <i class="bi bi-box display-4 text-primary opacity-75 mb-3"></i>
          <h2 class="fw-bold text-dark mb-0">{{ totalProducts }}</h2>
          <p class="text-muted fw-medium mb-0 text-uppercase small tracking-wide">Products</p>
        </div>
      </div>
    </div>
    
    <div class="col-md-6 col-lg-3">
      <div class="card h-100 shadow-sm border-0 border-start border-success border-4 rounded-3 card-hover text-center py-4">
        <div class="card-body">
          <i class="bi bi-building display-4 text-success opacity-75 mb-3"></i>
          <h2 class="fw-bold text-dark mb-0">{{ totalDepots }}</h2>
          <p class="text-muted fw-medium mb-0 text-uppercase small tracking-wide">Depots</p>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-lg-3">
      <div class="card h-100 shadow-sm border-0 border-start border-warning border-4 rounded-3 card-hover text-center py-4">
        <div class="card-body">
          <i class="bi bi-layers display-4 text-warning opacity-75 mb-3"></i>
          <h2 class="fw-bold text-dark mb-0">{{ totalEtageres }}</h2>
          <p class="text-muted fw-medium mb-0 text-uppercase small tracking-wide">Etageres</p>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-lg-3">
      <div class="card h-100 shadow-sm border-0 border-start border-danger border-4 rounded-3 card-hover text-center py-4">
        <div class="card-body">
           <i class="bi bi-people display-4 text-danger opacity-75 mb-3"></i>
           <h2 class="fw-bold text-dark mb-0">{{ totalUsers }}</h2>
           <p class="text-muted fw-medium mb-0 text-uppercase small tracking-wide">Users</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
.tracking-wide { letter-spacing: 1px; }
</style>
"""
}

count = 0
for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    count += 1
print(f"Phase 4 complete! Scaffolded {count} dashboard files.")
