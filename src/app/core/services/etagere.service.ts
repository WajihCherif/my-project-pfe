import { Injectable } from '@angular/core';
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
