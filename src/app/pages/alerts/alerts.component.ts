import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pg-title"><span class="icon">🔔</span> Alertes</div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-weight:700;font-size:15px">Alertes Actives</span>
        <span style="background:var(--amber);color:#fff;font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px">{{ alerts.length }} alertes</span>
      </div>
      <div style="display:flex;gap:8px">
        <select class="flt"><option>Toutes</option><option>Critiques</option><option>Warnings</option></select>
        <select class="flt"><option>Aujourd'hui</option><option>Cette semaine</option></select>
      </div>
    </div>

    <div class="card">
      <div class="alert-row" *ngFor="let al of alerts">
        <div class="al-icon" [class.red]="al.critical">{{ al.icon }}</div>
        <div class="al-sep"></div>
        <div class="al-msg">
          <strong>{{ al.title }}</strong>
          <small>{{ al.sub }}</small>
        </div>
        <div class="al-time">{{ al.time }}</div>
      </div>
    </div>
  `
})
export class AlertsComponent {
  alerts = [
    { icon:'⚠️', critical:false, title:'Boîte de conserve Heinz 400g temporairement retirée',   sub:'Timer: 5s — En attente de confirmation', time:'18:34' },
    { icon:'🔴', critical:true,  title:'Snack sucré Kinder Bueno retiré et confirmé manquant',  sub:'Durée dépassée — Action requise',         time:'17:33' },
    { icon:'⚠️', critical:false, title:"Incohérence détectée sur l'inventaire Produit X",       sub:'Écart entre dépôt et étagère',            time:'16:20' },
    { icon:'📷', critical:false, title:'Caméra Sortie D — Signal faible détecté',               sub:'Vérifier la connexion caméra',             time:'15:10' },
    { icon:'🔔', critical:false, title:'Rapport journalier disponible',                          sub:'24 produits analysés — 98% précision YOLO', time:'08:00' },
  ];
}