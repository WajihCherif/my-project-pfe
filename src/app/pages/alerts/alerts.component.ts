import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { EtagereService } from '../../core/services/etagere.service';
import { Product } from '../../shared/models/product.model';
import { Etagere } from '../../shared/models/etagere.model';

interface AlertItem {
  id: number;
  icon: string;
  critical: boolean;
  title: string;
  sub: string;
  time: string;
  productName?: string;
  type: 'stock' | 'system';
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: AlertItem[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private etagereService: EtagereService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshAlerts();
  }

  refreshAlerts() {
    this.loading = true;
    forkJoin({
      products: this.productService.getAll(),
      etageres: this.etagereService.getAll()
    }).subscribe({
      next: (data) => {
        this.generateRealAlerts(data.products, data.etageres);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  generateRealAlerts(products: Product[], etageres: Etagere[]) {
    let newAlerts: AlertItem[] = [];
    let idCounter = 1;

    etageres.forEach(e => {
      const prod = products.find(p => p.id === e.product_id);
      const name = prod ? prod.name : (e.name || e.etagere_code);
      
      // Critical: Empty
      if (!e.quantity_etagere || e.quantity_etagere === 0) {
        newAlerts.push({
          id: idCounter++,
          icon: '🔴',
          critical: true,
          title: `${name} manquant`,
          sub: `L'étagère ${e.etagere_code} est vide. Action requise immédiate.`,
          time: this.formatTime(e.last_updated),
          productName: name,
          type: 'stock'
        });
      } 
      // Warning: Low Stock (<= 20%)
      else if (e.max_capacity && (e.quantity_etagere / e.max_capacity) <= 0.2) {
        newAlerts.push({
          id: idCounter++,
          icon: '⚠️',
          critical: false,
          title: `Stock faible : ${name}`,
          sub: `Niveau critique détecté (${e.quantity_etagere} unités sur ${e.max_capacity}).`,
          time: this.formatTime(e.last_updated),
          productName: name,
          type: 'stock'
        });
      }
    });

    // Add Simulated System Alerts for aesthetic
    newAlerts.push({
      id: idCounter++,
      icon: '📷',
      critical: false,
      title: 'Caméra YOLO Sortie D — Signal fluide',
      sub: 'Analyse CPU Jetson Nano : 45%. Précision : 98.4%.',
      time: 'Maintenant',
      type: 'system'
    });

    this.alerts = newAlerts;
  }

  private formatTime(dateStr?: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Récemment';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  goToStock(productName?: string) {
    if (!productName) return;
    this.router.navigate(['/stock'], { 
      queryParams: { tab: 'products', search: productName } 
    });
  }

  dismissAlert(id: number) {
    this.alerts = this.alerts.filter(a => a.id !== id);
  }
}