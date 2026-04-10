import { Injectable } from '@angular/core';
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
