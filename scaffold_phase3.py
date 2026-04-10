import os

files = {
    # DEPOT LIST
    "src/app/features/depots/depot-list/depot-list.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepotService } from '../../../core/services/depot.service';
import { Depot } from '../../../shared/models/depot.model';

@Component({
  selector: 'app-depot-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './depot-list.component.html'
})
export class DepotListComponent implements OnInit {
  items: Depot[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private depotService: DepotService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.depotService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems() {
    if (!this.searchTerm) return this.items;
    return this.items.filter(i => JSON.stringify(i).toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  deleteItem(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this depot?')) return;
    this.depotService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/depots/depot-list/depot-list.component.html": """<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0"><i class="bi bi-building me-2"></i>Depots</h2>
    <a routerLink="/depots/new" class="btn btn-success fw-bold px-4 py-2 shadow-sm">
      <i class="bi bi-plus-lg me-2"></i>Add Depot
    </a>
  </div>

  <div *ngIf="error" class="alert alert-danger shadow-sm border-0">{{ error }}</div>

  <div class="card shadow-sm border-0">
    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
      <h5 class="m-0 text-muted fw-medium">Depot Locations</h5>
      <input type="text" class="form-control w-25 shadow-sm bg-light border-0" placeholder="Search depots..." [(ngModel)]="searchTerm">
    </div>
    
    <div class="card-body p-0">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
      </div>

      <div class="table-responsive" *ngIf="!loading">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="text-muted fw-semibold py-3">ID</th>
              <th class="text-muted fw-semibold py-3">Depot Code</th>
              <th class="text-muted fw-semibold py-3">Name</th>
              <th class="text-muted fw-semibold py-3">Location</th>
              <th class="text-muted fw-semibold py-3">Manager</th>
              <th class="text-muted fw-semibold py-3">Phone</th>
              <th class="text-muted fw-semibold py-3">Created At</th>
              <th class="text-muted fw-semibold py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of filteredItems">
              <td>#{{ d.id }}</td>
              <td><span class="badge bg-secondary">{{ d.depot_code }}</span></td>
              <td class="fw-medium">{{ d.name }}</td>
              <td>{{ d.location }}</td>
              <td>{{ d.manager_name }}</td>
              <td>{{ d.phone }}</td>
              <td>{{ d.created_at | date:'shortDate' }}</td>
              <td class="text-end">
                <a [routerLink]="['/depots', d.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i></a>
                <button (click)="deleteItem(d.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">No depots found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
""",

    # ETAGERE LIST
    "src/app/features/etageres/etagere-list/etagere-list.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EtagereService } from '../../../core/services/etagere.service';
import { Etagere } from '../../../shared/models/etagere.model';

@Component({
  selector: 'app-etagere-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './etagere-list.component.html'
})
export class EtagereListComponent implements OnInit {
  items: Etagere[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private etagereService: EtagereService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.etagereService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems() {
    if (!this.searchTerm) return this.items;
    return this.items.filter(i => JSON.stringify(i).toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  deleteItem(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this etagere?')) return;
    this.etagereService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/etageres/etagere-list/etagere-list.component.html": """<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0"><i class="bi bi-layers me-2"></i>Etageres</h2>
    <a routerLink="/etageres/new" class="btn btn-warning fw-bold px-4 py-2 shadow-sm text-dark">
      <i class="bi bi-plus-lg me-2"></i>Add Etagere
    </a>
  </div>

  <div *ngIf="error" class="alert alert-danger shadow-sm border-0">{{ error }}</div>

  <div class="card shadow-sm border-0">
    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
      <h5 class="m-0 text-muted fw-medium">Shelving Units</h5>
      <input type="text" class="form-control w-25 shadow-sm bg-light border-0" placeholder="Search etageres..." [(ngModel)]="searchTerm">
    </div>
    
    <div class="card-body p-0">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
      </div>

      <div class="table-responsive" *ngIf="!loading">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="text-muted fw-semibold py-3">ID</th>
              <th class="text-muted fw-semibold py-3">Etagere Code</th>
              <th class="text-muted fw-semibold py-3">Name</th>
              <th class="text-muted fw-semibold py-3">Depot ID</th>
              <th class="text-muted fw-semibold py-3">Product ID</th>
              <th class="text-muted fw-semibold py-3">Section</th>
              <th class="text-muted fw-semibold py-3">Quantity</th>
              <th class="text-muted fw-semibold py-3">Max Capacity</th>
              <th class="text-muted fw-semibold py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of filteredItems">
              <td>#{{ e.id }}</td>
              <td><span class="badge bg-secondary">{{ e.etagere_code }}</span></td>
              <td class="fw-medium">{{ e.name }}</td>
              <td>{{ e.depot_id }}</td>
              <td>{{ e.product_id }}</td>
              <td>{{ e.section }}</td>
              <td>{{ e.quantity }}</td>
              <td>{{ e.max_capacity }}</td>
              <td class="text-end">
                <a [routerLink]="['/etageres', e.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i></a>
                <button (click)="deleteItem(e.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">No etageres found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
""",

    # PRODUCT LIST
    "src/app/features/products/product-list/product-list.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  items: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems() {
    if (!this.searchTerm) return this.items;
    return this.items.filter(i => JSON.stringify(i).toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  deleteItem(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/products/product-list/product-list.component.html": """<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0"><i class="bi bi-box me-2"></i>Products</h2>
    <a routerLink="/products/new" class="btn btn-primary fw-bold px-4 py-2 shadow-sm">
      <i class="bi bi-plus-lg me-2"></i>Add Product
    </a>
  </div>

  <div *ngIf="error" class="alert alert-danger shadow-sm border-0">{{ error }}</div>

  <div class="card shadow-sm border-0">
    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
      <h5 class="m-0 text-muted fw-medium">Product Inventory</h5>
      <input type="text" class="form-control w-25 shadow-sm bg-light border-0" placeholder="Search products..." [(ngModel)]="searchTerm">
    </div>
    
    <div class="card-body p-0">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div class="table-responsive" *ngIf="!loading">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="text-muted fw-semibold py-3">ID</th>
              <th class="text-muted fw-semibold py-3">Product Code</th>
              <th class="text-muted fw-semibold py-3">Name</th>
              <th class="text-muted fw-semibold py-3">Category</th>
              <th class="text-muted fw-semibold py-3">Barcode</th>
              <th class="text-muted fw-semibold py-3">Price</th>
              <th class="text-muted fw-semibold py-3">Unit</th>
              <th class="text-muted fw-semibold py-3">Created At</th>
              <th class="text-muted fw-semibold py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredItems">
              <td>#{{ p.id }}</td>
              <td><span class="badge bg-secondary">{{ p.product_code }}</span></td>
              <td class="fw-medium">{{ p.name }}</td>
              <td>{{ p.category }}</td>
              <td>{{ p.barcode }}</td>
              <td>{{ p.price !== null ? '$' + p.price : '' }}</td>
              <td>{{ p.unit }}</td>
              <td>{{ p.created_at | date:'shortDate' }}</td>
              <td class="text-end">
                <a [routerLink]="['/products', p.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i></a>
                <button (click)="deleteItem(p.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">No products found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
""",

    # USER LIST
    "src/app/features/users/user-list/user-list.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  items: User[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems() {
    if (!this.searchTerm) return this.items;
    return this.items.filter(i => JSON.stringify(i).toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  deleteItem(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this user?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/users/user-list/user-list.component.html": """<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0 text-danger"><i class="bi bi-people me-2"></i>Users</h2>
    <a routerLink="/users/new" class="btn btn-danger fw-bold px-4 py-2 shadow-sm">
      <i class="bi bi-person-plus me-2"></i>Add User
    </a>
  </div>

  <div *ngIf="error" class="alert alert-danger shadow-sm border-0">{{ error }}</div>

  <div class="card shadow-sm border-0">
    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
      <h5 class="m-0 text-muted fw-medium">Administrators</h5>
      <input type="text" class="form-control w-25 shadow-sm bg-light border-0" placeholder="Search users by name/email..." [(ngModel)]="searchTerm">
    </div>
    
    <div class="card-body p-0">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status"></div>
      </div>

      <div class="table-responsive" *ngIf="!loading">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="text-muted fw-semibold py-3">ID</th>
              <th class="text-muted fw-semibold py-3">Username</th>
              <th class="text-muted fw-semibold py-3">Email</th>
              <th class="text-muted fw-semibold py-3">Role</th>
              <th class="text-muted fw-semibold py-3">Created At</th>
              <th class="text-muted fw-semibold py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of filteredItems">
              <td>#{{ u.id }}</td>
              <td class="fw-bold text-dark">{{ u.username }}</td>
              <td class="text-muted">{{ u.email }}</td>
              <td>
                <span class="badge rounded-pill" [ngClass]="u.role === 'admin' ? 'bg-danger' : 'bg-secondary'">{{ u.role | uppercase }}</span>
              </td>
              <td>{{ u.created_at | date:'shortDate' }}</td>
              <td class="text-end">
                <a [routerLink]="['/users', u.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i></a>
                <button (click)="deleteItem(u.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
"""
}

count = 0
for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    count += 1
print(f"Phase 3 complete! Scaffolded {count} list component files.")
