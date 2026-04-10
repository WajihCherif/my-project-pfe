import { Injectable } from '@angular/core';
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
