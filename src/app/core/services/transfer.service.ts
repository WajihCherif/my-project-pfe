import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Transfer, TransferCreate, TransferHistory } from '../../shared/models/transfer.model';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private apiUrl = `${environment.apiUrl}/transfers`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  // Get transfer history
  getHistory(limit: number = 50): Observable<TransferHistory[]> {
    return this.http.get<TransferHistory[]>(`${this.apiUrl}/history?limit=${limit}`)
      .pipe(catchError(this.handleError));
  }

  // Depot to Etagere
  createDepotToEtagere(data: TransferCreate): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/depot-to-etagere`, data)
      .pipe(catchError(this.handleError));
  }

  // Etagere to Depot
  createEtagereToDepot(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/etagere-to-depot`, data)
      .pipe(catchError(this.handleError));
  }

  // Legacy/Generic (if needed)
  getAll(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.apiUrl}/history`).pipe(catchError(this.handleError));
  }
}
