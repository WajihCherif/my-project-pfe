import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { EtagereService } from '../../core/services/etagere.service';
import { Product } from '../../shared/models/product.model';
import { Etagere } from '../../shared/models/etagere.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  realProducts: Product[] = [];
  etageres: Etagere[] = [];
  loading = true;

  onShelfCount = 0;
  tempRemovedCount = 0;
  removedCount = 0;
  problems: any[] = [];

  constructor(
    public router: Router, 
    private productService: ProductService,
    private etagereService: EtagereService
  ) {}

  ngOnInit() {
    this.loading = true;
    forkJoin({
      products: this.productService.getAll(),
      etageres: this.etagereService.getAll()
    }).subscribe({
      next: (data) => {
        this.realProducts = data.products;
        this.etageres = data.etageres;
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateStats() {
    this.onShelfCount = 0;
    this.removedCount = 0;
    this.tempRemovedCount = 0;
    this.problems = [];

    this.etageres.forEach(e => {
      const prod = this.realProducts.find(p => p.id === e.product_id);
      const name = prod ? prod.name : (e.name || e.etagere_code);

      if (e.quantity_etagere && e.quantity_etagere > 0) {
        this.onShelfCount++;
        
        // Low stock check (<= 20%)
        if (e.max_capacity && (e.quantity_etagere / e.max_capacity) <= 0.2) {
          this.tempRemovedCount++;
          this.problems.push({ name: name, label: 'Stock Faible', cls: 'warning' });
        }
      } else if (e.quantity_etagere === 0) {
        this.removedCount++;
        this.problems.push({ name: name, label: 'Manquant / Retiré', cls: 'danger' });
      }
    });
  }

  get recentProducts() {
    return [...this.realProducts]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 4);
  }

  get liveStatuses() {
    return this.etageres.map(e => {
      const prod = this.realProducts.find(p => p.id === e.product_id);
      const name = prod ? prod.name : (e.name || e.etagere_code);
      let status = 'ON_SHELF';
      let cls = 'on';

      if (!e.quantity_etagere || e.quantity_etagere === 0) {
        status = 'REMOVED';
        cls = 'rm';
      } else if (e.max_capacity && (e.quantity_etagere / e.max_capacity) <= 0.2) {
        status = 'LOW_STOCK';
        cls = 'tmp';
      }

      return {
        name: name,
        status: status,
        cls: cls,
        qty: e.quantity_etagere || 0
      };
    });
  }

  get totalProducts() {
    return this.realProducts.length > 0 ? this.realProducts.length : 0;
  }
}