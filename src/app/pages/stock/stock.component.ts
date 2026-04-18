import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Product, ProductCreate }  from '../../shared/models/product.model';
import { Depot, DepotCreate }    from '../../shared/models/depot.model';
import { Etagere, EtagereCreate }  from '../../shared/models/etagere.model';
import { Transfer, TransferCreate, TransferHistory } from '../../shared/models/transfer.model';
import { Stock } from '../../shared/models/stock.model';
import { User }     from '../../shared/models/user.model';

import { ProductService } from '../../core/services/product.service';
import { DepotService } from '../../core/services/depot.service';
import { EtagereService } from '../../core/services/etagere.service';
import { TransferService } from '../../core/services/transfer.service';
import { StockService } from '../../core/services/stock.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  activeTab: 'overview' | 'products' | 'etageres' | 'depots' | 'transfers' = 'overview';
  viewMode: 'table' | 'grid' = 'table';

  products:  Product[]  = [];
  depots:    Depot[]    = [];
  etageres:  Etagere[]  = [];
  transfers: TransferHistory[] = [];
  inventory: Stock[]    = []; // Added inventory tracking

  searchProduct  = '';
  searchDepot    = '';
  searchEtagere  = '';
  searchTransfer = '';

  loading = true;
  error   = '';

  // Stats
  totalStockValue = 0;
  lowStockCount   = 0;

  // Modal State... [Keeping existing modal states]
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
    private stockService: StockService, // Injected
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
      if (params['search']) {
        this.searchProduct = params['search'];
      }
      if (params['searchEtagere']) {
        this.searchEtagere = params['searchEtagere'];
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      products:  this.productService.getAll(),
      depots:    this.depotService.getAll(),
      etageres:  this.etagereService.getAll(),
      transfers: this.transferService.getHistory(),
      inventory: this.stockService.getAll(), // Added
    }).subscribe({
      next: (data) => {
        this.products  = data.products;
        this.depots    = data.depots;
        this.etageres  = data.etageres;
        this.transfers = data.transfers;
        this.inventory = data.inventory;
        this.calculateStats();
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

  setViewMode(mode: typeof this.viewMode) {
    this.viewMode = mode;
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


  get filteredTransfers(): TransferHistory[] { // Changed type
    const s = this.searchTransfer.toLowerCase();
    return this.transfers.filter(t => JSON.stringify(t).toLowerCase().includes(s));
  }

  // --- PRODUCT CRUD ---
  openProductModal(product: Product | null = null) {
    this.editingProduct = product ? { ...product } : { product_code: '', name: '', price: 0, unit: 'mm', category: '' };
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
    this.editingEtagere = etagere ? { ...etagere } : { etagere_code: '', name: '', depot_id: this.depots[0]?.id || 0, quantity_etagere: 0, max_capacity: 100 };
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
    this.editingTransfer = { 
      product_id: this.products[0]?.id, 
      from_depot_id: this.depots[0]?.id, 
      to_etagere_id: this.etageres[0]?.id, 
      quantity: 1 
    } as any;
    this.showTransferModal = true;
  }

  saveTransfer() {
    if (!this.editingTransfer) return;
    this.transferService.createDepotToEtagere(this.editingTransfer as TransferCreate).subscribe({
      next: () => { this.showTransferModal = false; this.loadData(); },
      error: (err) => { this.error = 'Erreur: ' + err.message; }
    });
  }

  // --- STATISTICS CALCULATION ---
  calculateStats() {
    let totalValue = 0;
    let lowCount = 0;

    this.etageres.forEach(e => {
      // Total value calculation (if product linked)
      if (e.product_id && e.quantity_etagere) {
        const prod = this.products.find(p => p.id === e.product_id);
        if (prod && prod.price) {
          totalValue += e.quantity_etagere * prod.price;
        }
      }

      // Low stock check (less than 20% capacity)
      if (e.max_capacity && e.quantity_etagere !== undefined) {
        const pct = (e.quantity_etagere / e.max_capacity) * 100;
        if (pct <= 20) {
          lowCount++;
        }
      }
    });

    this.totalStockValue = totalValue;
    this.lowStockCount = lowCount;
  }

  get recentTransfers(): TransferHistory[] { // Changed type
    return [...this.transfers]
      .sort((a, b) => new Date(b.transferred_at || 0).getTime() - new Date(a.transferred_at || 0).getTime())
      .slice(0, 5);
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

  getInventoryQty(productId: number | undefined): number {
    if (!productId) return 0;
    const item = this.inventory.find(i => i.product_id === productId);
    return item ? item.quantity_stock : 0;
  }

  getBarcode(productId: number | undefined): string {
    if (!productId) return '';
    const item = this.inventory.find(i => i.product_id === productId);
    return item ? item.barcode : '';
  }

  // --- LOOKUP HELPERS ---
  getProductName(id: number | undefined): string {
    if (!id) return 'Inconnu';
    const p = this.products.find(x => x.id === id);
    return p ? (p.name || p.product_code) : `Produit #${id}`;
  }

  getEtagereName(id: number | undefined): string {
    if (!id) return 'Inconnue';
    const e = this.etageres.find(x => x.id === id);
    return e ? (e.name || e.etagere_code) : `Étagère #${id}`;
  }

  getDepotName(id: number | undefined): string {
    if (!id) return 'Inconnu';
    const d = this.depots.find(x => x.id === id);
    return d ? d.name : `Dépôt #${id}`;
  }
}