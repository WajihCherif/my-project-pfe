import os

files = {
    "src/environments/environment.ts": """
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'
};
""",
    "src/environments/environment.prod.ts": """
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8000'
};
""",
    "src/app/shared/models/user.model.ts": """
export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
  password?: string;
}
""",
    "src/app/shared/models/product.model.ts": """
export interface Product {
  id?: number;
  name: string;
  reference: string;
  quantity: number;
  price: number;
  etagere_id: number;
  depot_id: number;
}
""",
    "src/app/shared/models/depot.model.ts": """
export interface Depot {
  id?: number;
  name: string;
  location: string;
  capacity: number;
}
""",
    "src/app/shared/models/etagere.model.ts": """
export interface Etagere {
  id?: number;
  name: string;
  depot_id: number;
  capacity: number;
  current_stock: number;
}
""",
    "src/app/shared/models/transfer.model.ts": """
export interface Transfer {
  id?: number;
  product_id: number;
  from_etagere_id: number;
  to_etagere_id: number;
  quantity: number;
  date?: string;
}
""",
    "src/app/core/interceptors/auth.interceptor.ts": """
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
""",
    "src/app/core/guards/auth.guard.ts": """
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
""",
    "src/app/core/services/auth.service.ts": """
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.access_token || res.token) {
          localStorage.setItem('token', res.access_token || res.token);
          if (res.user) {
             localStorage.setItem('user', JSON.stringify(res.user));
          }
        }
      })
    );
  }

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
""",
    "src/app/core/services/product.service.ts": """
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/depot.service.ts": """
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Depot } from '../../shared/models/depot.model';

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

  create(data: Depot): Observable<Depot> {
    return this.http.post<Depot>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Depot): Observable<Depot> {
    return this.http.put<Depot>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/etagere.service.ts": """
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Etagere } from '../../shared/models/etagere.model';

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

  create(data: Etagere): Observable<Etagere> {
    return this.http.post<Etagere>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Etagere): Observable<Etagere> {
    return this.http.put<Etagere>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/user.service.ts": """
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../shared/models/user.model';

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

  create(data: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
""",
    "src/app/core/services/transfer.service.ts": """
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Transfer } from '../../shared/models/transfer.model';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private apiUrl = `${environment.apiUrl}/transfer`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  transfer(data: Transfer): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, data).pipe(catchError(this.handleError));
  }
}
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\\n")

print("Part 1: Core, Environments and Models generated successfully!")
