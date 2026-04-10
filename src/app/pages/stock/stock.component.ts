import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { EtagereService } from '../../services/etagere.service';
import { SalesService } from '../../services/sales.service';
import { Stock } from '../../models/stock.model';
import { Etagere } from '../../models/etagere.model';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  activeTab = 'etagere';
  search = '';
  tabs = [
    { id: 'etagere', label: '🏪 Étagère (23)' },
    { id: 'depot',   label: '📦 Dépôt (24)'   },
    { id: 'etageres', label: '📚 Étagères' },
    { id: 'diff',    label: '⚠️ Différence (1)' },
  ];

  stocks: Stock[] = [];
  etageres: Etagere[] = [];
  theftCheck: { hasTheft: boolean; message: string } | null = null;

  // For adding new items
  newStock: Stock = { item_name: '', nb_stock: 0, nb_depot: 0, etagere_id: 1 };
  newEtagere: Etagere = { nom_etagere: '', code: '', zone: '' };

  constructor(
    public stockService: StockService,
    public etagereService: EtagereService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.checkForTheft();
  }

  loadData(): void {
    this.stocks = this.stockService.getStocks();
    this.etageres = this.etagereService.getEtageres();
  }

  checkForTheft(): void {
    this.theftCheck = this.salesService.checkForTheft();
  }

  // For display, create etagere items like before
  get etagereItems() {
    return this.stocks.map(stock => {
      const etagere = this.etageres.find(e => e.id === stock.etagere_id);
      return {
        num: stock.id?.toString().padStart(2, '0'),
        name: stock.item_name,
        status: stock.nb_stock > 0 ? 'ON_SHELF' : 'REMOVED',
        cls: stock.nb_stock > 0 ? 'on' : 'rm',
        qty: stock.nb_stock.toString(),
        qtyColor: stock.nb_stock === 0 ? 'var(--red)' : '',
        conf: '0.90', // placeholder
        confColor: 'var(--green)',
        time: new Date().toTimeString().split(' ')[0]
      };
    });
  }

  get depotItems() {
    return this.stocks.map(stock => {
      const etagere = this.etageres.find(e => e.id === stock.etagere_id);
      const qtyE = stock.nb_stock; // assuming nb_stock is on shelf
      return {
        num: stock.id?.toString().padStart(2, '0'),
        name: stock.item_name,
        qtyD: stock.nb_depot.toString(),
        qtyE: qtyE.toString(),
        qtyEColor: qtyE === 0 ? 'var(--red)' : '',
        status: qtyE === stock.nb_depot ? 'Complet' : 'Partiel',
        cls: qtyE > 0 ? 'on' : 'rm'
      };
    });
  }

  get filteredEtagere() {
    return this.etagereItems.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  get filteredDepot() {
    return this.depotItems.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  addStock(): void {
    this.stockService.addStock({ ...this.newStock });
    this.newStock = { item_name: '', nb_stock: 0, nb_depot: 0, etagere_id: 1 };
    this.loadData();
    this.checkForTheft();
  }

  addEtagere(): void {
    this.etagereService.addEtagere({ ...this.newEtagere });
    this.newEtagere = { nom_etagere: '', code: '', zone: '' };
    this.loadData();
  }
}