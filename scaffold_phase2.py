import os

files = {
    # DEPOT FORM
    "src/app/features/depots/depot-form/depot-form.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepotService } from '../../../core/services/depot.service';
import { Depot } from '../../../shared/models/depot.model';

@Component({
  selector: 'app-depot-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './depot-form.component.html'
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
      depot_code: ['', Validators.required],
      name: ['', Validators.required],
      location: [''],
      address: [''],
      manager_name: [''],
      phone: ['']
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
      next: (depot: Depot) => {
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
    "src/app/features/depots/depot-form/depot-form.component.html": """<div class="container-fluid" style="max-width: 800px; margin: 0 auto;">
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
          <div class="col-md-6">
            <label class="form-label fw-medium">Depot Code</label>
            <input type="text" class="form-control" formControlName="depot_code">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Depot Name</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          <div class="col-md-12">
            <label class="form-label fw-medium">Location</label>
            <input type="text" class="form-control" formControlName="location">
          </div>
          <div class="col-md-12">
            <label class="form-label fw-medium">Address</label>
            <textarea class="form-control" formControlName="address" rows="2"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Manager Name</label>
            <input type="text" class="form-control" formControlName="manager_name">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Phone</label>
            <input type="text" class="form-control" formControlName="phone">
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

    # ETAGERE FORM
    "src/app/features/etageres/etagere-form/etagere-form.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EtagereService } from '../../../core/services/etagere.service';
import { DepotService } from '../../../core/services/depot.service';
import { ProductService } from '../../../core/services/product.service';
import { Etagere } from '../../../shared/models/etagere.model';
import { Depot } from '../../../shared/models/depot.model';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-etagere-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './etagere-form.component.html'
})
export class EtagereFormComponent implements OnInit {
  etagereForm!: FormGroup;
  etagereId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';
  
  depots: Depot[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private etagereService: EtagereService,
    private depotService: DepotService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.etagereForm = this.fb.group({
      etagere_code: ['', Validators.required],
      name: ['', Validators.required],
      depot_id: [null, Validators.required],
      product_id: [null],
      section: [''],
      quantity: [0, Validators.min(0)],
      max_capacity: [100, Validators.min(1)]
    });

    this.depotService.getAll().subscribe(d => this.depots = d);
    this.productService.getAll().subscribe(p => this.products = p);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.etagereId = +idParam;
      this.loadEtagere();
    }
  }

  loadEtagere(): void {
    this.loading = true;
    this.etagereService.getById(this.etagereId!).subscribe({
      next: (etagere: Etagere) => {
        this.etagereForm.patchValue(etagere);
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.etagereForm.invalid) return;
    this.submitting = true;

    // Convert product_id empty string to null
    const formVal = { ...this.etagereForm.value };
    if (!formVal.product_id) formVal.product_id = null;

    const request = this.etagereId 
      ? this.etagereService.update(this.etagereId, formVal)
      : this.etagereService.create(formVal);

    request.subscribe({
      next: () => {
        this.showToast('Etagere saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/etageres']), 1000);
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
    "src/app/features/etageres/etagere-form/etagere-form.component.html": """<div class="container-fluid" style="max-width: 800px; margin: 0 auto;">
  <div *ngIf="toastMessage" class="toast align-items-center show position-fixed top-0 end-0 m-3 text-white bg-{{ toastType }} border-0 shadow-lg" role="alert" style="z-index: 1055;">
    <div class="d-flex"><div class="toast-body fw-medium">{{ toastMessage }}</div></div>
  </div>

  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0">{{ etagereId ? 'Edit Etagere' : 'Add New Etagere' }}</h2>
    <a routerLink="/etageres" class="btn btn-light shadow-sm fw-medium">Back to List</a>
  </div>

  <div class="card shadow-sm border-0">
    <div class="card-body p-4">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-warning"></div>
      </div>
      
      <form *ngIf="!loading" [formGroup]="etagereForm" (ngSubmit)="onSubmit()">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-medium">Etagere Code</label>
            <input type="text" class="form-control" formControlName="etagere_code">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Etagere Name</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          
          <div class="col-md-6">
            <label class="form-label fw-medium">Depot</label>
            <select formControlName="depot_id" class="form-select">
              <option [value]="null" disabled>Select Depot...</option>
              <option *ngFor="let d of depots" [value]="d.id">{{ d.name }} ({{ d.depot_code }})</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Product</label>
            <select formControlName="product_id" class="form-select">
              <option [value]="null">-- None --</option>
              <option *ngFor="let p of products" [value]="p.id">{{ p.name }} ({{ p.product_code }})</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-medium">Section</label>
            <input type="text" class="form-control" formControlName="section">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-medium">Current Quantity</label>
            <input type="number" class="form-control" formControlName="quantity">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-medium">Max Capacity</label>
            <input type="number" class="form-control" formControlName="max_capacity">
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-top text-end">
          <button type="button" routerLink="/etageres" class="btn btn-light me-2">Cancel</button>
          <button type="submit" class="btn btn-warning px-4 fw-bold shadow-sm" [disabled]="etagereForm.invalid || submitting">
            <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span> Save Etagere
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
""",

    # PRODUCT FORM
    "src/app/features/products/product-form/product-form.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html'
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
      product_code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      category: [''],
      barcode: [''],
      price: [0, Validators.min(0)],
      unit: ['piece']
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
      next: (product: Product) => {
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
    "src/app/features/products/product-form/product-form.component.html": """<div class="container-fluid" style="max-width: 800px; margin: 0 auto;">
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
            <label class="form-label fw-medium">Product Code</label>
            <input type="text" class="form-control" formControlName="product_code">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Product Name</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          
          <div class="col-md-12">
            <label class="form-label fw-medium">Description</label>
            <textarea class="form-control" formControlName="description" rows="2"></textarea>
          </div>

          <div class="col-md-6">
             <label class="form-label fw-medium">Category</label>
             <input type="text" class="form-control" formControlName="category">
          </div>
          <div class="col-md-6">
             <label class="form-label fw-medium">Barcode</label>
             <input type="text" class="form-control" formControlName="barcode">
          </div>

          <div class="col-md-6">
            <label class="form-label fw-medium">Price</label>
            <input type="number" class="form-control" formControlName="price" step="0.01">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Unit</label>
            <input type="text" class="form-control" formControlName="unit">
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-top text-end">
          <button type="button" routerLink="/products" class="btn btn-light me-2">Cancel</button>
          <button type="submit" class="btn btn-primary px-4 fw-bold shadow-sm" [disabled]="productForm.invalid || submitting">
            <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span> Save Product
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
""",

    # USER FORM
    "src/app/features/users/user-form/user-form.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['manager', Validators.required],
      password: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.loadUser();
    } else {
      this.userForm.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.controls['password'].updateValueAndValidity();
    }
  }

  loadUser(): void {
    this.loading = true;
    this.userService.getById(this.userId!).subscribe({
      next: (user: User) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role
        });
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.submitting = true;

    const data = { ...this.userForm.value };
    if (this.userId && !data.password) {
      delete data.password;
    }

    const request = this.userId 
      ? this.userService.update(this.userId, data)
      : this.userService.create(data);

    request.subscribe({
      next: () => {
        this.showToast('User saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/users']), 1000);
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
    "src/app/features/users/user-form/user-form.component.html": """<div class="container-fluid" style="max-width: 800px; margin: 0 auto;">
  <div *ngIf="toastMessage" class="toast align-items-center show position-fixed top-0 end-0 m-3 text-white bg-{{ toastType }} border-0 shadow-lg" role="alert" style="z-index: 1055;">
    <div class="d-flex"><div class="toast-body fw-medium">{{ toastMessage }}</div></div>
  </div>

  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0 text-danger">{{ userId ? 'Edit User' : 'Add New User' }}</h2>
    <a routerLink="/users" class="btn btn-light shadow-sm fw-medium">Back to List</a>
  </div>

  <div class="card shadow-sm border-0 border-top border-danger border-4">
    <div class="card-body p-4">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-danger"></div>
      </div>
      
      <form *ngIf="!loading" [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">Username</label>
            <input type="text" class="form-control" formControlName="username">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">Email Address</label>
            <input type="email" class="form-control" formControlName="email">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">Role</label>
            <select class="form-select" formControlName="role">
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">Password <small class="text-muted fw-normal" *ngIf="userId">(leave blank to keep)</small></label>
            <input type="password" class="form-control" formControlName="password" placeholder="******">
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-top text-end">
          <button type="button" routerLink="/users" class="btn btn-light me-2">Cancel</button>
          <button type="submit" class="btn btn-danger px-4 fw-bold shadow-sm" [disabled]="userForm.invalid || submitting">
            <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span> Save User
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
""",

    # TRANSFER FORM
    "src/app/features/transfer/transfer.component.ts": """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferService } from '../../core/services/transfer.service';
import { ProductService } from '../../core/services/product.service';
import { EtagereService } from '../../core/services/etagere.service';
import { Product } from '../../shared/models/product.model';
import { Etagere } from '../../shared/models/etagere.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  loading = false;
  toastMessage = '';
  toastType = 'success';
  
  products: Product[] = [];
  etageres: Etagere[] = [];

  constructor(
    private fb: FormBuilder, 
    private transferService: TransferService,
    private productService: ProductService,
    private etagereService: EtagereService
  ) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      product_id: [null, Validators.required],
      from_etagere_id: [null, Validators.required],
      to_etagere_id: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    });

    this.productService.getAll().subscribe(data => this.products = data);
    this.etagereService.getAll().subscribe(data => this.etageres = data);
  }

  onSubmit(): void {
    if (this.transferForm.invalid) return;
    this.loading = true;

    this.transferService.transfer(this.transferForm.value).subscribe({
      next: () => {
        this.showToast('Transfer completed successfully!', 'success');
        this.transferForm.reset({ quantity: 1 });
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
""",
    "src/app/features/transfer/transfer.component.html": """<div class="container-fluid" style="max-width: 800px; margin: 0 auto;">
  <div *ngIf="toastMessage" class="toast align-items-center show position-fixed top-0 end-0 m-3 text-white bg-{{ toastType }} border-0 shadow-lg" role="alert" style="z-index: 1055;">
    <div class="d-flex"><div class="toast-body fw-medium">{{ toastMessage }}</div></div>
  </div>

  <h2 class="fw-bold mb-4 text-info"><i class="bi bi-arrow-left-right me-2"></i>Stock Transfer</h2>

  <div class="card shadow-sm border-0 border-top border-info border-4">
    <div class="card-body p-4">
      <div class="alert alert-light border border-info-subtle mb-4 shadow-sm text-center text-info-emphasis">
        <i class="bi bi-info-circle me-1"></i> Use this form to move quantities of a product from one Etagere to another.
      </div>
      
      <form [formGroup]="transferForm" (ngSubmit)="onSubmit()">
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label fw-medium text-muted">Product</label>
            <select formControlName="product_id" class="form-select form-select-lg bg-light">
              <option [value]="null" disabled selected>Select a Product...</option>
              <option *ngFor="let p of products" [value]="p.id">{{ p.name }} ({{ p.product_code }})</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">From Etagere</label>
             <select formControlName="from_etagere_id" class="form-select form-select-lg bg-light">
              <option [value]="null" disabled selected>Select Source...</option>
              <option *ngFor="let e of etageres" [value]="e.id">{{ e.name }} ({{ e.etagere_code }})</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">To Etagere</label>
            <select formControlName="to_etagere_id" class="form-select form-select-lg bg-light">
              <option [value]="null" disabled selected>Select Destination...</option>
              <option *ngFor="let e of etageres" [value]="e.id">{{ e.name }} ({{ e.etagere_code }})</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">Transfer Quantity</label>
            <input type="number" class="form-control form-control-lg bg-light" formControlName="quantity">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">Transfer Notes</label>
            <input type="text" class="form-control form-control-lg bg-light" formControlName="notes" placeholder="Optional notes...">
          </div>
        </div>
        
        <div class="mt-4 pt-3 text-end">
          <button type="submit" class="btn btn-info px-5 py-2 fw-bold text-white shadow-sm" [disabled]="transferForm.invalid || loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span> Execute Transfer
          </button>
        </div>
      </form>
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
print(f"Phase 2 complete! Scaffolded {count} form component files.")
