import os

files = {
    "src/app/shared/models/depot.model.ts": """export interface Depot {
  id?: number;
  depot_code: string;
  name: string;
  location?: string;
  address?: string;
  manager_name?: string;
  phone?: string;
  created_at?: string;
}

export interface DepotCreate {
  depot_code: string;
  name: string;
  location?: string;
  address?: string;
  manager_name?: string;
  phone?: string;
}
""",
    "src/app/shared/models/etagere.model.ts": """export interface Etagere {
  id?: number;
  etagere_code: string;
  depot_id: number;
  product_id?: number;
  name: string;
  section?: string;
  quantity?: number;
  max_capacity?: number;
  last_restocked?: string;
  last_updated?: string;
}

export interface EtagereCreate {
  etagere_code: string;
  depot_id: number;
  product_id?: number | null;
  name: string;
  section?: string;
  quantity?: number;
  max_capacity?: number;
}
""",
    "src/app/shared/models/product.model.ts": """export interface Product {
  id?: number;
  product_code: string;
  name: string;
  description?: string;
  category?: string;
  barcode?: string;
  price?: number;
  unit?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCreate {
  product_code: string;
  name: string;
  description?: string;
  category?: string;
  barcode?: string;
  price?: number;
  unit?: string;
}
""",
    "src/app/shared/models/user.model.ts": """export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password?: string;
  role: string;
}
""",
    "src/app/shared/models/transfer.model.ts": """export interface Transfer {
  id?: number;
  product_id: number;
  from_etagere_id: number;
  to_etagere_id: number;
  quantity: number;
  transfer_date?: string;
  notes?: string;
}

export interface TransferCreate {
  product_id: number;
  from_etagere_id: number;
  to_etagere_id: number;
  quantity: number;
  transfer_date?: string;
  notes?: string;
}
""",
    "src/app/core/services/depot.service.ts": """import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Depot, DepotCreate } from '../../shared/models/depot.model';

@Injectable({ providedIn: 'root' })
export class DepotService {
  private apiUrl = `${environment.apiUrl}/depots`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<Depot[]> {
    return this.http.get<Depot[]>(`${this.apiUrl}/`).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Depot> {
    return this.http.get<Depot>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: DepotCreate): Observable<Depot> {
    return this.http.post<Depot>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Partial<DepotCreate>): Observable<Depot> {
    return this.http.put<Depot>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/etagere.service.ts": """import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Etagere, EtagereCreate } from '../../shared/models/etagere.model';

@Injectable({ providedIn: 'root' })
export class EtagereService {
  private apiUrl = `${environment.apiUrl}/etageres`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<Etagere[]> {
    return this.http.get<Etagere[]>(`${this.apiUrl}/`).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Etagere> {
    return this.http.get<Etagere>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: EtagereCreate): Observable<Etagere> {
    return this.http.post<Etagere>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Partial<EtagereCreate>): Observable<Etagere> {
    return this.http.put<Etagere>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/product.service.ts": """import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Product, ProductCreate } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: ProductCreate): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Partial<ProductCreate>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/user.service.ts": """import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { User, UserCreate } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/`).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: UserCreate): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Partial<UserCreate>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/transfer.service.ts": """import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Transfer, TransferCreate } from '../../shared/models/transfer.model';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private apiUrl = `${environment.apiUrl}/transfer`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  transfer(data: TransferCreate): Observable<Transfer> {
    return this.http.post<Transfer>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }
}
"""
}

count = 0
for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    count += 1
print(f"Phase 1 complete! Scaffolded {count} models and services files.")
