import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Stock, StockUpdate } from '../../shared/models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/`).pipe(catchError(this.handleError));
  }

  getByProductId(productId: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${productId}`).pipe(catchError(this.handleError));
  }

  getByBarcode(barcode: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/by-barcode/${barcode}`).pipe(catchError(this.handleError));
  }

  updateQuantity(productId: number, quantity: number): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${productId}`, { quantity_stock: quantity } as StockUpdate)
      .pipe(catchError(this.handleError));
  }
}
