import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  alerts = [
    { id: 1, icon:'⚠️', critical:false, title:'Boîte de conserve Heinz 400g temporairement retirée',   sub:'Timer: 5s — En attente de confirmation', time:'18:34' },
    { id: 2, icon:'🔴', critical:true,  title:'Snack sucré Kinder Bueno retiré et confirmé manquant',  sub:'Durée dépassée — Action requise',         time:'17:33' },
    { id: 3, icon:'⚠️', critical:false, title:"Incohérence détectée sur l'inventaire Produit X",       sub:'Écart entre dépôt et étagère',            time:'16:20' },
    { id: 4, icon:'📷', critical:false, title:'Caméra Sortie D — Signal faible détecté',               sub:'Vérifier la connexion caméra',             time:'15:10' },
    { id: 5, icon:'🔔', critical:false, title:'Rapport journalier disponible',                          sub:'24 produits analysés — 98% précision YOLO', time:'08:00' },
  ];

  dismissAlert(id: number) {
    this.alerts = this.alerts.filter(a => a.id !== id);
  }
}