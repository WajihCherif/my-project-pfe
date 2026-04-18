import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { Alert } from '../../shared/models/alert.model';

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
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: AlertItem[] = [];
  loading = true;

  constructor(
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshAlerts();
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
      // Determine critical status based on actual quantity or alert type
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
    // If backend doesn't support delete yet, just hide it locally
    this.alerts = this.alerts.filter(a => a.id !== id);
  }
}