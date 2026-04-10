import os

files = {
    # PRODUCTS LIST
    "src/app/features/products/product-list/product-list.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems(): Product[] {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.reference.toLowerCase().includes(term)
    );
  }

  deleteProduct(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/products/product-list/product-list.component.html": """
<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0"><i class="bi bi-box me-2"></i>Products</h2>
    <a routerLink="/products/new" class="btn btn-primary fw-bold px-4 py-2 shadow-sm">
      <i class="bi bi-plus-lg me-2"></i>Add Product
    </a>
  </div>

  <div *ngIf="errorMessage" class="alert alert-danger shadow-sm border-0">{{ errorMessage }}</div>

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
              <th>ID</th>
              <th>Reference</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredItems">
              <td>#{{ p.id }}</td>
              <td><span class="badge bg-secondary">{{ p.reference }}</span></td>
              <td class="fw-medium">{{ p.name }}</td>
              <td>{{ p.quantity }}</td>
              <td>${{ p.price | number:'1.2-2' }}</td>
              <td class="text-end">
                <a [routerLink]="['/products', p.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i> Edit</a>
                <button (click)="deleteProduct(p.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Delete</button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">No products found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
""",
    "src/app/features/products/product-list/product-list.component.css": """
th { font-weight: 600; font-size: 0.9rem; text-transform: uppercase; color: #6c757d; }
""",
    
    # PRODUCTS FORM
    "src/app/features/products/product-form/product-form.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  productId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      reference: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      depot_id: [null, Validators.required],
      etagere_id: [null, Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = +idParam;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getById(this.productId!).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    this.submitting = true;

    const request = this.productId 
      ? this.productService.update(this.productId, this.productForm.value)
      : this.productService.create(this.productForm.value);

    request.subscribe({
      next: () => {
        this.showToast('Product saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/products']), 1000);
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.submitting = false;
      }
    });
  }

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
""",
    "src/app/features/products/product-form/product-form.component.html": """
<div class="container-fluid max-w-md">
  
  <div *ngIf="toastMessage" class="toast align-items-center show position-fixed top-0 end-0 m-3 text-white bg-{{ toastType }} border-0 shadow-lg" role="alert" style="z-index: 1055;">
    <div class="d-flex">
      <div class="toast-body fw-medium">{{ toastMessage }}</div>
    </div>
  </div>

  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0">{{ productId ? 'Edit Product' : 'Add New Product' }}</h2>
    <a routerLink="/products" class="btn btn-light shadow-sm fw-medium">Back to List</a>
  </div>

  <div class="card shadow-sm border-0">
    <div class="card-body p-4">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
      
      <form *ngIf="!loading" [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-medium">Product Name</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Reference Code</label>
            <input type="text" class="form-control" formControlName="reference">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Quantity</label>
            <input type="number" class="form-control" formControlName="quantity">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Price</label>
            <input type="number" class="form-control" formControlName="price">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Depot ID</label>
            <input type="number" class="form-control" formControlName="depot_id">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Etagere ID</label>
            <input type="number" class="form-control" formControlName="etagere_id">
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-top text-end">
          <button type="button" routerLink="/products" class="btn btn-light me-2">Cancel</button>
          <button type="submit" class="btn btn-primary px-4 fw-bold shadow-sm" [disabled]="productForm.invalid || submitting">
            <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
            Save Product
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
""",
    "src/app/features/products/product-form/product-form.component.css": """
.max-w-md { max-width: 800px; margin: 0 auto; }
""",

    # DEPOTS LIST
    "src/app/features/depots/depot-list/depot-list.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepotService } from '../../../core/services/depot.service';
import { Depot } from '../../../shared/models/depot.model';

@Component({
  selector: 'app-depot-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './depot-list.component.html',
  styleUrls: ['./depot-list.component.css']
})
export class DepotListComponent implements OnInit {
  depots: Depot[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private depotService: DepotService) {}

  ngOnInit(): void {
    this.loadDepots();
  }

  loadDepots(): void {
    this.loading = true;
    this.depotService.getAll().subscribe({
      next: (data) => {
        this.depots = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems(): Depot[] {
    if (!this.searchTerm) return this.depots;
    const term = this.searchTerm.toLowerCase();
    return this.depots.filter(d => d.name.toLowerCase().includes(term) || d.location.toLowerCase().includes(term));
  }

  deleteDepot(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this depot?')) return;
    this.depotService.delete(id).subscribe({
      next: () => this.loadDepots(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/depots/depot-list/depot-list.component.html": """
<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0"><i class="bi bi-building me-2"></i>Depots</h2>
    <a routerLink="/depots/new" class="btn btn-success fw-bold px-4 py-2 shadow-sm">
      <i class="bi bi-plus-lg me-2"></i>Add Depot
    </a>
  </div>

  <div *ngIf="errorMessage" class="alert alert-danger shadow-sm border-0">{{ errorMessage }}</div>

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
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of filteredItems">
              <td>#{{ d.id }}</td>
              <td class="fw-medium">{{ d.name }}</td>
              <td>{{ d.location }}</td>
              <td>{{ d.capacity }}</td>
              <td class="text-end">
                <a [routerLink]="['/depots', d.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i> Edit</a>
                <button (click)="deleteDepot(d.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Delete</button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">No depots found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
""",
    "src/app/features/depots/depot-list/depot-list.component.css": """
th { font-weight: 600; font-size: 0.9rem; text-transform: uppercase; color: #6c757d; }
""",

    # DEPOT FORM
    "src/app/features/depots/depot-form/depot-form.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepotService } from '../../../core/services/depot.service';

@Component({
  selector: 'app-depot-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './depot-form.component.html',
  styleUrls: ['./depot-form.component.css']
})
export class DepotFormComponent implements OnInit {
  depotForm!: FormGroup;
  depotId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';

  constructor(
    private fb: FormBuilder,
    private depotService: DepotService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.depotForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.depotId = +idParam;
      this.loadDepot();
    }
  }

  loadDepot(): void {
    this.loading = true;
    this.depotService.getById(this.depotId!).subscribe({
      next: (depot) => {
        this.depotForm.patchValue(depot);
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.depotForm.invalid) return;
    this.submitting = true;

    const request = this.depotId 
      ? this.depotService.update(this.depotId, this.depotForm.value)
      : this.depotService.create(this.depotForm.value);

    request.subscribe({
      next: () => {
        this.showToast('Depot saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/depots']), 1000);
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.submitting = false;
      }
    });
  }

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
""",
    "src/app/features/depots/depot-form/depot-form.component.html": """
<div class="container-fluid max-w-md">
  <div *ngIf="toastMessage" class="toast align-items-center show position-fixed top-0 end-0 m-3 text-white bg-{{ toastType }} border-0 shadow-lg" role="alert" style="z-index: 1055;">
    <div class="d-flex"><div class="toast-body fw-medium">{{ toastMessage }}</div></div>
  </div>

  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0">{{ depotId ? 'Edit Depot' : 'Add New Depot' }}</h2>
    <a routerLink="/depots" class="btn btn-light shadow-sm fw-medium">Back to List</a>
  </div>

  <div class="card shadow-sm border-0">
    <div class="card-body p-4">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
      </div>
      
      <form *ngIf="!loading" [formGroup]="depotForm" (ngSubmit)="onSubmit()">
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label fw-medium">Depot Name</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Location</label>
            <input type="text" class="form-control" formControlName="location">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Total Capacity</label>
            <input type="number" class="form-control" formControlName="capacity">
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-top text-end">
          <button type="button" routerLink="/depots" class="btn btn-light me-2">Cancel</button>
          <button type="submit" class="btn btn-success px-4 fw-bold shadow-sm" [disabled]="depotForm.invalid || submitting">
            <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span> Save Depot
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
""",
    "src/app/features/depots/depot-form/depot-form.component.css": """
.max-w-md { max-width: 800px; margin: 0 auto; }
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\\n")

print("Part 4: Products and Depots features generated.")
