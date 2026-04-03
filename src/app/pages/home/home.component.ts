import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pg-title"><span class="icon">🏠</span> Home — Vue d'ensemble</div>

    <div class="search">
      <span style="color:var(--text-3)">🔍</span>
      <input type="text" placeholder="Rechercher produit...">
    </div>

    <div class="stats-row">
      <div class="stat-chip">Total produits : <strong>24</strong></div>
      <div class="stat-chip">Problèmes : <strong style="color:var(--red)">3</strong></div>
    </div>

    <div class="banners">
      <button class="banner gr" (click)="router.navigate(['/stock'])">📦 Total produits : 24 <span>›</span></button>
      <button class="banner rd" (click)="router.navigate(['/alerts'])">⚠️ Problèmes : 3 <span>›</span></button>
    </div>

    <div class="home-kpi">
      <div class="kpi gr"><div class="kpi-label">ON SHELF</div><div class="kpi-val">21</div><div class="kpi-sub">Produits détectés</div></div>
      <div class="kpi am"><div class="kpi-label">TEMP REMOVED</div><div class="kpi-val">1</div><div class="kpi-sub">En cours de vérif.</div></div>
      <div class="kpi rd"><div class="kpi-label">REMOVED</div><div class="kpi-val">1</div><div class="kpi-sub">Confirmé manquant</div></div>
      <div class="kpi bl"><div class="kpi-label">TOTAL DÉPÔT</div><div class="kpi-val">24</div><div class="kpi-sub">Inventaire initial</div></div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title">Liste des Produits</span><button class="card-menu">···</button></div>
        <table class="tbl">
          <thead><tr><th>Produit</th><th>État</th><th>Quantité</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td>{{ p.name }}</td>
              <td><span class="chip" [ngClass]="p.cls"><span class="ch-dot"></span>{{ p.status }}</span></td>
              <td>{{ p.qty }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title">Produits avec Problème</span><button class="card-menu">···</button></div>
        <table class="tbl">
          <thead><tr><th>Produit</th><th>Problème</th><th>Depuis</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of problems">
              <td>
                <div style="font-weight:600">{{ p.name }}</div>
                <div style="font-size:11px;color:var(--text-3)" *ngIf="p.since">Depuis: {{ p.since }}</div>
              </td>
              <td><span class="pb" [ngClass]="p.cls">{{ p.label }}</span></td>
              <td style="font-family:monospace;color:var(--text-3);font-size:12px">{{ p.duration }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`.home-kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px;}`]
})
export class HomeComponent {
  constructor(public router: Router) {}

  products = [
    { name: "Bouteille d'eau",  status: 'ON_SHELF',      cls: 'on',  qty: 24 },
    { name: 'Boite de conserve',status: 'TEMP_REMOVED',  cls: 'tmp', qty: 23 },
    { name: 'Paquet de pâtes',  status: 'ON_SHELF',      cls: 'on',  qty: 24 },
    { name: 'Snack sucré',      status: 'REMOVED',       cls: 'rm',  qty: 22 },
    { name: 'Produit E',        status: 'ON_SHELF',      cls: 'on',  qty: 9  },
    { name: 'Produit F',        status: 'ON_SHELF',      cls: 'on',  qty: 15 },
    { name: 'Produit G',        status: 'ON_SHELF',      cls: 'on',  qty: 23 },
    { name: 'Produit H',        status: 'ON_SHELF',      cls: 'on',  qty: 12 },
  ];

  problems = [
    { name: 'Boîte de conserve', since: '5s',   label: '⚠️ Temporairement enlevé', cls: 'tmp',  duration: '5s'   },
    { name: 'Snack sucré',       since: '1min', label: '🔴 Retiré Confirmé',        cls: 'conf', duration: '1min' },
    { name: 'Produit X',         since: '',     label: '⚠️ Incohérence stock',      cls: 'inc',  duration: '—'    },
  ];
}