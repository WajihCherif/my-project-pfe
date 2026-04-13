import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface Product {
  id: number;
  product_code: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  barcode: string;
}

interface Depot {
  id: number;
  depot_code: string;
  name: string;
  location: string;
  manager_name: string;
  phone: string;
}

interface Etagere {
  id: number;
  etagere_code: string;
  name: string;
  section: string;
  quantity: number;
  max_capacity: number;
  depot_id: number;
  product_id: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

interface Transfer {
  id: number;
  product_id: number;
  from_etagere_id: number;
  to_etagere_id: number;
  quantity: number;
  transfer_date: string;
  notes: string;
}

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

  loading   = true;
  error     = '';
  activeTab = 'products';


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    forkJoin({
      products:  this.http.get<Product[]>(`${this.apiUrl}/products`, { headers }),
      depots:    this.http.get<Depot[]>(`${this.apiUrl}/depots`, { headers }),
      etageres:  this.http.get<Etagere[]>(`${this.apiUrl}/etageres`, { headers }),
      users:     this.http.get<User[]>(`${this.apiUrl}/users`, { headers }),
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
        this.error   = 'Erreur de chargement des données.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  setTab(tab: string) { this.activeTab = tab; }

  get filteredProducts() {
    return this.products.filter(p =>
      JSON.stringify(p).toLowerCase().includes(this.searchProduct.toLowerCase())
    );
  }

  get filteredDepots() {
    return this.depots.filter(d =>
      JSON.stringify(d).toLowerCase().includes(this.searchDepot.toLowerCase())
    );
  }

  get filteredEtageres() {
    return this.etageres.filter(e =>
      JSON.stringify(e).toLowerCase().includes(this.searchEtagere.toLowerCase())
    );
  }

  get filteredUsers() {
    return this.users.filter(u =>
      JSON.stringify(u).toLowerCase().includes(this.searchUser.toLowerCase())
    );
  }

  get filteredTransfers() {
    return this.transfers.filter(t =>
      JSON.stringify(t).toLowerCase().includes(this.searchTransfer.toLowerCase())
    );
  }
}