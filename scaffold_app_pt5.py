import os

files = {
    # ETAGERES LIST
    "src/app/features/etageres/etagere-list/etagere-list.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EtagereService } from '../../../core/services/etagere.service';
import { Etagere } from '../../../shared/models/etagere.model';

@Component({
  selector: 'app-etagere-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './etagere-list.component.html',
  styleUrls: ['./etagere-list.component.css']
})
export class EtagereListComponent implements OnInit {
  etageres: Etagere[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private etagereService: EtagereService) {}

  ngOnInit(): void {
    this.loadEtageres();
  }

  loadEtageres(): void {
    this.loading = true;
    this.etagereService.getAll().subscribe({
      next: (data) => {
        this.etageres = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems(): Etagere[] {
    if (!this.searchTerm) return this.etageres;
    const term = this.searchTerm.toLowerCase();
    return this.etageres.filter(e => e.name?.toLowerCase().includes(term));
  }

  deleteEtagere(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this etagere?')) return;
    this.etagereService.delete(id).subscribe({
      next: () => this.loadEtageres(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/etageres/etagere-list/etagere-list.component.html": """
<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0"><i class="bi bi-layers me-2"></i>Etageres</h2>
    <a routerLink="/etageres/new" class="btn btn-warning fw-bold px-4 py-2 shadow-sm text-dark">
      <i class="bi bi-plus-lg me-2"></i>Add Etagere
    </a>
  </div>

  <div *ngIf="errorMessage" class="alert alert-danger shadow-sm border-0">{{ errorMessage }}</div>

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
              <th>ID</th>
              <th>Name</th>
              <th>Depot ID</th>
              <th>Capacity</th>
              <th>Current Stock</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of filteredItems">
              <td>#{{ e.id }}</td>
              <td class="fw-medium">{{ e.name }}</td>
              <td>{{ e.depot_id }}</td>
              <td>{{ e.capacity }}</td>
              <td>
                <span class="badge" [ngClass]="{'bg-danger': e.current_stock > e.capacity, 'bg-success': e.current_stock <= e.capacity}">
                  {{ e.current_stock || 0 }} / {{ e.capacity }}
                </span>
              </td>
              <td class="text-end">
                <a [routerLink]="['/etageres', e.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i> Edit</a>
                <button (click)="deleteEtagere(e.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Delete</button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">No etageres found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
""",
    "src/app/features/etageres/etagere-list/etagere-list.component.css": """
th { font-weight: 600; font-size: 0.9rem; text-transform: uppercase; color: #6c757d; }
""",

    # ETAGERE FORM
    "src/app/features/etageres/etagere-form/etagere-form.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EtagereService } from '../../../core/services/etagere.service';

@Component({
  selector: 'app-etagere-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './etagere-form.component.html',
  styleUrls: ['./etagere-form.component.css']
})
export class EtagereFormComponent implements OnInit {
  etagereForm!: FormGroup;
  etagereId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';

  constructor(
    private fb: FormBuilder,
    private etagereService: EtagereService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.etagereForm = this.fb.group({
      name: ['', Validators.required],
      depot_id: [null, Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
      current_stock: [0, Validators.min(0)]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.etagereId = +idParam;
      this.loadEtagere();
    }
  }

  loadEtagere(): void {
    this.loading = true;
    this.etagereService.getById(this.etagereId!).subscribe({
      next: (etagere) => {
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

    const request = this.etagereId 
      ? this.etagereService.update(this.etagereId, this.etagereForm.value)
      : this.etagereService.create(this.etagereForm.value);

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
    "src/app/features/etageres/etagere-form/etagere-form.component.html": """
<div class="container-fluid max-w-md">
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
            <label class="form-label fw-medium">Etagere Name / Code</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Depot ID</label>
            <input type="number" class="form-control" formControlName="depot_id">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Max Capacity</label>
            <input type="number" class="form-control" formControlName="capacity">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium">Current Stock</label>
            <input type="number" class="form-control" formControlName="current_stock">
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
    "src/app/features/etageres/etagere-form/etagere-form.component.css": """
.max-w-md { max-width: 800px; margin: 0 auto; }
""",

    # TRANSFERS
    "src/app/features/transfer/transfer.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferService } from '../../core/services/transfer.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  loading = false;
  toastMessage = '';
  toastType = 'success';

  constructor(private fb: FormBuilder, private transferService: TransferService) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      product_id: [null, Validators.required],
      from_etagere_id: [null, Validators.required],
      to_etagere_id: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.transferForm.invalid) return;
    this.loading = true;

    this.transferService.transfer(this.transferForm.value).subscribe({
      next: () => {
        this.showToast('Transfer completed successfully!', 'success');
        this.transferForm.reset();
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
    "src/app/features/transfer/transfer.component.html": """
<div class="container-fluid max-w-md">
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
            <label class="form-label fw-medium text-muted">Product ID</label>
            <input type="number" class="form-control form-control-lg bg-light" formControlName="product_id">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">From Etagere ID</label>
            <input type="number" class="form-control form-control-lg bg-light" formControlName="from_etagere_id">
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-muted">To Etagere ID</label>
            <input type="number" class="form-control form-control-lg bg-light" formControlName="to_etagere_id">
          </div>
          <div class="col-md-12">
            <label class="form-label fw-medium text-muted">Quantity</label>
            <input type="number" class="form-control form-control-lg bg-light" formControlName="quantity">
          </div>
        </div>
        
        <div class="mt-4 pt-3 text-end">
          <button type="submit" class="btn btn-info px-5 py-2 fw-bold text-white shadow-sm hover-shadow" [disabled]="transferForm.invalid || loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span> Execute Transfer
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
""",
    "src/app/features/transfer/transfer.component.css": """
.max-w-md { max-width: 700px; margin: 0 auto; }
.hover-shadow:hover { box-shadow: 0 4px 10px rgba(13, 202, 240, 0.3) !important; transform: translateY(-1px); }
""",

    # USERS LIST
    "src/app/features/users/user-list/user-list.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems(): User[] {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u => u.username?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term));
  }

  deleteUser(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this user?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert(err.message)
    });
  }
}
""",
    "src/app/features/users/user-list/user-list.component.html": """
<div class="container-fluid">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold m-0 text-danger"><i class="bi bi-people me-2"></i>Users</h2>
    <a routerLink="/users/new" class="btn btn-danger fw-bold px-4 py-2 shadow-sm">
      <i class="bi bi-person-plus me-2"></i>Add User
    </a>
  </div>

  <div *ngIf="errorMessage" class="alert alert-danger shadow-sm border-0">{{ errorMessage }}</div>

  <div class="card shadow-sm border-0">
    <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
      <h5 class="m-0 text-muted fw-medium">System Administrators</h5>
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
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th class="text-end">Actions</th>
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
              <td>{{ u.created_at | date:'mediumDate' }}</td>
              <td class="text-end">
                <a [routerLink]="['/users', u.id]" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil"></i> Edit</a>
                <button (click)="deleteUser(u.id)" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Delete</button>
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
""",
    "src/app/features/users/user-list/user-list.component.css": """
th { font-weight: 600; font-size: 0.9rem; text-transform: uppercase; color: #6c757d; }
""",

    # USER FORM
    "src/app/features/users/user-form/user-form.component.ts": """
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
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
      next: (user) => {
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

    // Remove password if it's empty (during edit)
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
    "src/app/features/users/user-form/user-form.component.html": """
<div class="container-fluid max-w-md">
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
    "src/app/features/users/user-form/user-form.component.css": """
.max-w-md { max-width: 800px; margin: 0 auto; }
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\\n")

print("Part 5: Etageres, Transfers and Users features generated.")
