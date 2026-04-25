import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { ProductService } from '../../core/services/product.service';
import { Alert } from '../../shared/models/alert.model';
import { Product } from '../../shared/models/product.model';

export interface AlertItem {
  id: number;
  icon: string;
  critical: boolean;
  title: string;
  sub: string;
  time: string;
  productName?: string;
  type: 'stock' | 'system';
  
  // Database specific fields
  alert_type?: string;
  expected_quantity?: number;
  actual_quantity?: number;
  difference?: number;
  quantity_stock?: number;
  quantity_etagere?: number;
  quantity_depot?: number;
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: AlertItem[] = [];
  loading = true;
  
  filterSeverity: string = 'all';
  filterDate: string = 'today';

  // --- Diagnostic Tools State ---
  products: Product[] = [];
  diagSelectedProductId: number | null = null;
  diagSystemStock: number | null = null;
  diagExpectedEtagere: number | null = null;
  diagExpectedDepot: number | null = null;

  diagEtagereCount: number | null = null;
  diagDepotCount: number | null = null;
  
  isScanning: boolean = false;
  scanComplete: boolean = false;
  diagResult: any = null;

  constructor(
    private alertService: AlertService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshAlerts();
    this.productService.getAll().subscribe(data => this.products = data);
  }

  get filteredAlerts(): AlertItem[] {
    return this.alerts.filter(a => {
      if (this.filterSeverity === 'critical' && !a.critical) return false;
      if (this.filterSeverity === 'info' && a.critical) return false;
      return true;
    });
  }

  refreshAlerts() {
    this.loading = true;
    this.alertService.getAll().subscribe({
      next: (backendAlerts) => {
        this.generateRealAlerts(backendAlerts);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  generateRealAlerts(backendAlerts: Alert[]) {
    let newAlerts: AlertItem[] = [];

    backendAlerts.forEach(backendAlert => {
      const isCritical = backendAlert.alert_type === 'missing' || backendAlert.actual_quantity === 0;
      newAlerts.push({
        id: backendAlert.id,
        icon: isCritical ? '🔴' : '⚠️',
        critical: isCritical,
        title: `Alerte Stock : ${backendAlert.product_name}`,
        sub: backendAlert.message || `Anomalie détectée: Qté attendue (${backendAlert.expected_quantity}) ≠ Qté réelle (${backendAlert.actual_quantity}).`,
        time: this.formatTime(backendAlert.created_at),
        productName: backendAlert.product_name,
        type: 'stock',
        alert_type: backendAlert.alert_type,
        expected_quantity: backendAlert.expected_quantity,
        actual_quantity: backendAlert.actual_quantity,
        difference: backendAlert.difference,
        quantity_stock: backendAlert.quantity_stock,
        quantity_etagere: backendAlert.quantity_etagere,
        quantity_depot: backendAlert.quantity_depot
      });
    });

    // Add Simulated System Alerts for aesthetic
    newAlerts.push({
      id: 999999, // Fake numeric ID
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

  getEcart(): number | null {
    if (this.diagSystemStock == null || (this.diagDepotCount == null && this.diagEtagereCount == null)) return null;
    const totalTrouve = (this.diagDepotCount || 0) + (this.diagEtagereCount || 0);
    return totalTrouve - this.diagSystemStock;
  }

  calculerEtAlerter() {
    if (this.diagSystemStock == null || this.diagEtagereCount == null || this.diagDepotCount == null) return;
    
    // Condition Dynamique & Automatique :
    // Sépare le calcul pour le dépôt et l'étagère
    const expectedEta = this.diagExpectedEtagere || Math.floor(this.diagSystemStock * 0.4);
    const expectedDep = this.diagExpectedDepot || (this.diagSystemStock - expectedEta);

    const diffEtagere = expectedEta - this.diagEtagereCount;
    const diffDepot = expectedDep - this.diagDepotCount;
    const diffTotal = diffEtagere + diffDepot;
    const actualTotal = this.diagEtagereCount + this.diagDepotCount;
    
    if (diffTotal !== 0 && this.diagSelectedProductId) {
      const prod = this.products.find(p => p.id == this.diagSelectedProductId);
      const prodName = prod ? prod.name : 'Produit Inconnu';
      
      const alertPayload = {
        product_id: this.diagSelectedProductId,
        product_name: prodName,
        alert_type: diffTotal > 0 ? "missing" : "excess",
        expected_quantity: this.diagSystemStock,
        actual_quantity: actualTotal,
        difference: Math.abs(diffTotal),
        message: diffTotal > 0 
          ? `ALERTE MANQUANTS SÉPARÉS: ${diffEtagere > 0 ? diffEtagere + ' manquants sur étagère' : 'Étagère Conforme'}, ${diffDepot > 0 ? diffDepot + ' manquants au dépôt' : 'Dépôt Conforme'}.`
          : `ALERTE EXCÈS: Stock excédentaire de ${Math.abs(diffTotal)} produits.`,
        quantity_stock: this.diagSystemStock,
        quantity_etagere: this.diagEtagereCount,
        quantity_depot: this.diagDepotCount
      };

      this.alertService.createAlert(alertPayload).subscribe({
        next: (createdAlert) => {
          this.refreshAlerts();
          this.resetDiagnostic();
        },
        error: (err) => console.error("Could not save diagnostic alert", err)
      });
    } else {
      this.resetDiagnostic();
    }
  }

  resetDiagnostic() {
    this.diagSystemStock = null;
    this.diagExpectedEtagere = null;
    this.diagExpectedDepot = null;
    this.diagEtagereCount = null;
    this.diagDepotCount = null;
    this.diagSelectedProductId = null;
    this.scanComplete = false;
    this.diagResult = null;
  }
}