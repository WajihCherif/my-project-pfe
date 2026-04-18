import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Alert } from '../../shared/models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private apiUrl = `${environment.apiUrl}/alerts`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail || 'Server error occurred'));
  }

  getAll(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/`).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
