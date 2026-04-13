import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';

interface AlertItem {
  id: number;
  icon: string;
  critical: boolean;
  title: string;
  sub: string;
  time: string;
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

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (products) => {
        // Generate mock alerts dynamically using database products if available
        let genAlerts: AlertItem[] = [];
        
        if (products.length > 0) {
          const p1 = products[0];
          genAlerts.push({ id: 1, icon: '⚠️', critical: false, title: `${p1.name} temporairement retiré`, sub: 'Timer: 5s — En attente de confirmation YOLO', time: '18:34' });
        }
        
        if (products.length > 1) {
          const p2 = products[1];
          genAlerts.push({ id: 2, icon: '🔴', critical: true, title: `${p2.name} retiré et confirmé manquant`, sub: 'Durée dépassée — Action requise immédiate', time: '17:33' });
        }
        
        // Static system alerts
        genAlerts.push({ id: 3, icon: '📷', critical: false, title: 'Caméra YOLO Sortie D — Signal faible', sub: 'Vérifier la connexion avec la Jetson Nano / Caméra IP', time: '15:10' });
        genAlerts.push({ id: 4, icon: '🔔', critical: false, title: 'Rapport d\'analyse stock matinal disponible', sub: `Analyse complétée sur la base de données — Précision détectée 98.4%`, time: '08:00' });
        
        this.alerts = genAlerts;
      },
      error: () => {
        // Fallback demo
        this.alerts = [
          { id: 1, icon:'⚠️', critical:false, title:'Boîte de conserve Heinz 400g temporairement retirée',   sub:'Timer: 5s — En attente de confirmation', time:'18:34' },
          { id: 2, icon:'🔴', critical:true,  title:'Snack sucré Kinder Bueno retiré et confirmé manquant',  sub:'Durée dépassée — Action requise',         time:'17:33' },
          { id: 3, icon:'📷', critical:false, title:'Caméra Sortie D — Signal faible détecté',               sub:'Vérifier la connexion caméra',             time:'15:10' },
          { id: 4, icon:'🔔', critical:false, title:'Rapport journalier disponible',                          sub:'24 produits analysés — 98% précision',     time:'08:00' },
        ];
      }
    });
  }

  dismissAlert(id: number) {
    this.alerts = this.alerts.filter(a => a.id !== id);
  }
}