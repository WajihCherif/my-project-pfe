import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Product, ProductCreate }  from '../../shared/models/product.model';
import { Depot, DepotCreate }    from '../../shared/models/depot.model';
import { Etagere, EtagereCreate }  from '../../shared/models/etagere.model';
import { Transfer, TransferCreate } from '../../shared/models/transfer.model';
import { User }     from '../../shared/models/user.model';

import { ProductService } from '../../core/services/product.service';
import { DepotService } from '../../core/services/depot.service';
import { EtagereService } from '../../core/services/etagere.service';
import { TransferService } from '../../core/services/transfer.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  activeTab: 'overview' | 'products' | 'etageres' | 'depots' | 'transfers' | 'users' = 'overview';

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

  // Modal State
  showProductModal = false;
  editingProduct: any = null;

  showEtagereModal = false;
  editingEtagere: any = null;

  showDepotModal = false;
  editingDepot: any = null;

  showTransferModal = false;
  editingTransfer: any = null;

  constructor(
    private productService: ProductService,
    private depotService: DepotService,
    private etagereService: EtagereService,
    private transferService: TransferService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      products:  this.productService.getAll(),
      depots:    this.depotService.getAll(),
      etageres:  this.etagereService.getAll(),
      users:     this.userService.getAll(),
      transfers: this.transferService.getAll(),
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
        this.error   = 'Erreur de chargement. ' + (err.message || 'Verifiez votre connexion.');
        this.loading = false;
        console.error(err);
      }
    });
  }

  // --- TAB MANAGEMENT ---
  setTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
  }

  // --- FILTERS ---
  get filteredProducts(): Product[] {
    const s = this.searchProduct.toLowerCase();
    return this.products.filter(p => JSON.stringify(p).toLowerCase().includes(s));
  }

  get filteredDepots(): Depot[] {
    const s = this.searchDepot.toLowerCase();
    return this.depots.filter(d => JSON.stringify(d).toLowerCase().includes(s));
  }

  get filteredEtageres(): Etagere[] {
    const s = this.searchEtagere.toLowerCase();
    return this.etageres.filter(e => JSON.stringify(e).toLowerCase().includes(s));
  }

  get filteredUsers(): User[] {
    const s = this.searchUser.toLowerCase();
    return this.users.filter(u => JSON.stringify(u).toLowerCase().includes(s));
  }

  get filteredTransfers(): Transfer[] {
    const s = this.searchTransfer.toLowerCase();
    return this.transfers.filter(t => JSON.stringify(t).toLowerCase().includes(s));
  }

  // --- PRODUCT CRUD ---
  openProductModal(product: Product | null = null) {
    this.editingProduct = product ? { ...product } : { product_code: '', name: '', price: 0, unit: 'kg', category: '' };
    this.showProductModal = true;
  }

  saveProduct() {
    if (!this.editingProduct) return;
    const isEditing = 'id' in this.editingProduct;

    if (isEditing) {
      this.productService.update((this.editingProduct as Product).id!, this.editingProduct).subscribe({
        next: () => { this.showProductModal = false; this.loadData(); },
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    } else {
      this.productService.create(this.editingProduct as ProductCreate).subscribe({
        next: () => { this.showProductModal = false; this.loadData(); },
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    }
  }

  // --- ETAGERE CRUD ---
  openEtagereModal(etagere: Etagere | null = null) {
    this.editingEtagere = etagere ? { ...etagere } : { etagere_code: '', name: '', depot_id: this.depots[0]?.id || 0, quantity: 0, max_capacity: 100 };
    this.showEtagereModal = true;
  }

  saveEtagere() {
    if (!this.editingEtagere) return;
    const isEditing = 'id' in this.editingEtagere;

    if (isEditing) {
      this.etagereService.update((this.editingEtagere as Etagere).id!, this.editingEtagere).subscribe({
        next: () => { this.showEtagereModal = false; this.loadData(); },
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    } else {
      this.etagereService.create(this.editingEtagere as EtagereCreate).subscribe({
        next: () => { this.showEtagereModal = false; this.loadData(); },
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    }
  }

  deleteEtagere(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette etagere ?')) {
      this.etagereService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    }
  }

  // --- DEPOT CRUD ---
  openDepotModal(depot: Depot | null = null) {
    this.editingDepot = depot ? { ...depot } : { depot_code: '', name: '', location: '' };
    this.showDepotModal = true;
  }

  saveDepot() {
    if (!this.editingDepot) return;
    const isEditing = 'id' in this.editingDepot;

    if (isEditing) {
      this.depotService.update((this.editingDepot as Depot).id!, this.editingDepot).subscribe({
        next: () => { this.showDepotModal = false; this.loadData(); },
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    } else {
      this.depotService.create(this.editingDepot as DepotCreate).subscribe({
        next: () => { this.showDepotModal = false; this.loadData(); },
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    }
  }

  deleteDepot(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce depot ?')) {
      this.depotService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    }
  }

  // --- TRANSFER CRUD ---
  openTransferModal() {
    this.editingTransfer = { product_id: undefined, from_etagere_id: undefined, to_etagere_id: undefined, quantity: 1 } as any;
    this.showTransferModal = true;
  }

  saveTransfer() {
    if (!this.editingTransfer) return;
    this.transferService.create(this.editingTransfer as TransferCreate).subscribe({
      next: () => { this.showTransferModal = false; this.loadData(); },
      error: (err) => { this.error = 'Erreur: ' + err.message; }
    });
  }

  deleteTransfer(id: number) {
    if (confirm('Voulez-vous annuler ce transfert ?')) {
      this.transferService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => { this.error = 'Erreur: ' + err.message; }
      });
    }
  }

  // --- UTILS ---
  stockLevel(qty: number, max: number): string {
    if (!max || max === 0) return 'danger';
    const pct = (qty / max) * 100;
    if (pct <= 20) return 'danger';
    if (pct <= 50) return 'warning';
    return 'success';
  }

  stockLabel(qty: number, max: number): string {
    if (!max || max === 0) return 'Critique';
    const pct = (qty / max) * 100;
    if (pct <= 20) return 'Critique';
    if (pct <= 50) return 'Moyen';
    return 'OK';
  }
}