import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { Product }  from '../../shared/models/product.model';
import { Depot }    from '../../shared/models/depot.model';
import { Etagere }  from '../../shared/models/etagere.model';
import { Transfer } from '../../shared/models/transfer.model';
import { User }     from '../../shared/models/user.model';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  private apiUrl = 'http://localhost:8000';

  products:  Product[]  = [];
  depots:    Depot[]    = [];
  etageres:  Etagere[]  = [];
  users:     User[]     = [];
  transfers: Transfer[] = [];

  searchProduct  = '';
  searchDepot    = '';
  searchEtagere  = '';
  searchUser     = '';
  searchTransfer = '';

  loading = true;
  error   = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token   = localStorage.getItem('token') ?? '';
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    forkJoin({
      products:  this.http.get<Product[]>(`${this.apiUrl}/products`,   { headers }),
      depots:    this.http.get<Depot[]>(`${this.apiUrl}/depots`,       { headers }),
      etageres:  this.http.get<Etagere[]>(`${this.apiUrl}/etageres`,   { headers }),
      users:     this.http.get<User[]>(`${this.apiUrl}/users`,         { headers }),
      transfers: this.http.get<Transfer[]>(`${this.apiUrl}/transfers`, { headers }),
    }).subscribe({
      next: (data) => {
        this.products  = data.products;
        this.depots    = data.depots;
        this.etageres  = data.etageres;
        this.users     = data.users;
        this.transfers = data.transfers;
        this.loading   = false;
      },
      error: (err) => {
        this.error   = 'Erreur de chargement. Verifiez que le backend tourne sur localhost:8000';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredProducts(): Product[] {
    const s = this.searchProduct.toLowerCase();
    return this.products.filter(p =>
      JSON.stringify(p).toLowerCase().includes(s)
    );
  }

  get filteredDepots(): Depot[] {
    const s = this.searchDepot.toLowerCase();
    return this.depots.filter(d =>
      JSON.stringify(d).toLowerCase().includes(s)
    );
  }

  get filteredEtageres(): Etagere[] {
    const s = this.searchEtagere.toLowerCase();
    return this.etageres.filter(e =>
      JSON.stringify(e).toLowerCase().includes(s)
    );
  }

  get filteredUsers(): User[] {
    const s = this.searchUser.toLowerCase();
    return this.users.filter(u =>
      JSON.stringify(u).toLowerCase().includes(s)
    );
  }

  get filteredTransfers(): Transfer[] {
    const s = this.searchTransfer.toLowerCase();
    return this.transfers.filter(t =>
      JSON.stringify(t).toLowerCase().includes(s)
    );
  }

  stockLevel(qty: number, max: number): string {
    const pct = (qty / max) * 100;
    if (pct <= 20) return 'danger';
    if (pct <= 50) return 'warning';
    return 'success';
  }

  stockLabel(qty: number, max: number): string {
    const pct = (qty / max) * 100;
    if (pct <= 20) return 'Critique';
    if (pct <= 50) return 'Moyen';
    return 'OK';
  }
}