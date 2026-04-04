import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  access_token: string;
  utilisateur: UserResponse;
}

export interface SignupPayload {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role?: string;
}

export interface UserResponse {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private readonly userKey = 'currentUser';
  private readonly tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(email: string, mot_de_passe: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      email,
      mot_de_passe,
    }).pipe(
      tap((response) => this.setCurrentUser(response.utilisateur, response.access_token))
    );
  }

  signup(payload: SignupPayload): Observable<UserResponse> {
    const body = { ...payload, role: payload.role ?? 'user' };
    return this.http.post<UserResponse>(`${this.apiUrl}/utilisateurs`, body);
  }

  updateAccount(id: number, payload: Partial<SignupPayload>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/utilisateurs/${id}`, payload).pipe(
      tap((user) => this.setCurrentUser(user))
    );
  }

  deleteAccount(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/utilisateurs/${id}`);
  }

  setCurrentUser(user: UserResponse, token?: string): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getCurrentUser(): UserResponse | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) as UserResponse : null;
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
  }
}
