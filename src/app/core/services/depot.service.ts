import { Injectable } from '@angular/core';
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
