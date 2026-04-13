import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Transfer, TransferCreate } from '../../shared/models/transfer.model';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private apiUrl = `${environment.apiUrl}/transfers`; // Updated to plural if get is plural, or we simply use standard.

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  create(data: TransferCreate): Observable<Transfer> {
    const postUrl = `${environment.apiUrl}/transfer/`; // Keeping original endpoint for post
    return this.http.post<Transfer>(postUrl, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
