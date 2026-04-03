import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pg-title"><span class="icon">📦</span> Stock</div>

    <div class="search">
      <span style="color:var(--text-3)">🔍</span>
      <input type="text" placeholder="Rechercher produit..." [(ngModel)]="search">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:var(--green-bg);border:1px solid var(--green-border);border-radius:var(--radius);padding:16px;text-align:center;box-shadow:var(--shadow)">
        <div style="font-size:11px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Produits Étagère</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:30px;font-weight:700;color:var(--green)">23</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:4px">Détectés par YOLO</div>
      </div>
      <div style="background:var(--blue-bg);border:1px solid rgba(37,99,235,0.2);border-radius:var(--radius);padding:16px;text-align:center;box-shadow:var(--shadow)">
        <div style="font-size:11px;font-weight:600;color:var(--blue);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Produits Dépôt</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:30px;font-weight:700;color:var(--blue)">24</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:4px">Inventaire total</div>
      </div>
      <div style="background:var(--red-bg);border:1px solid rgba(214,59,59,0.2);border-radius:var(--radius);padding:16px;text-align:center;box-shadow:var(--shadow)">
        <div style="font-size:11px;font-weight:600;color:var(--red);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Différence</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:30px;font-weight:700;color:var(--red)">-1</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:4px">Produit(s) manquant(s)</div>
      </div>
    </div>

    <div class="stock-tabs" style="margin-bottom:14px">
      <button class="stab" *ngFor="let t of tabs" [class.active]="activeTab===t.id" (click)="activeTab=t.id">{{ t.label }}</button>
    </div>

    <!-- Étagère -->
    <div *ngIf="activeTab==='etagere'" class="card">
      <div class="card-hdr">
        <span class="card-title">🏪 Produits sur l'Étagère</span>
        <span style="font-size:11px;color:var(--green);font-weight:700">● YOLO temps réel</span>
      </div>
      <table class="tbl">
        <thead><tr><th>#</th><th>Produit</th><th>État</th><th>Qté</th><th>Conf.</th><th>Détection</th></tr></thead>
        <tbody>
          <tr *ngFor="let p of filteredEtagere">
            <td style="color:var(--text-3);font-size:12px">{{ p.num }}</td>
            <td>{{ p.name }}</td>
            <td><span class="chip" [ngClass]="p.cls"><span class="ch-dot"></span>{{ p.status }}</span></td>
            <td style="font-family:monospace;font-weight:700" [style.color]="p.qtyColor">{{ p.qty }}</td>
            <td style="font-family:monospace;font-size:12px" [style.color]="p.confColor">{{ p.conf }}</td>
            <td style="font-size:11px;color:var(--text-3)">{{ p.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dépôt -->
    <div *ngIf="activeTab==='depot'" class="card">
      <div class="card-hdr">
        <span class="card-title">📦 Produits en Dépôt</span>
        <span style="font-size:11px;color:var(--blue);font-weight:700">Inventaire initial</span>
      </div>
      <table class="tbl">
        <thead><tr><th>#</th><th>Produit</th><th>Qté Dépôt</th><th>Qté Étagère</th><th>Statut</th></tr></thead>
        <tbody>
          <tr *ngFor="let p of filteredDepot">
            <td style="color:var(--text-3);font-size:12px">{{ p.num }}</td>
            <td>{{ p.name }}</td>
            <td style="font-family:monospace;font-weight:700;color:var(--blue)">{{ p.qtyD }}</td>
            <td style="font-family:monospace" [style.color]="p.qtyEColor">{{ p.qtyE }}</td>
            <td><span class="chip" [ngClass]="p.cls"><span class="ch-dot"></span>{{ p.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Différence -->
    <div *ngIf="activeTab==='diff'" class="card">
      <div class="card-hdr">
        <span class="card-title">⚠️ Différence Dépôt / Étagère</span>
        <span style="font-size:11px;color:var(--red);font-weight:700">Produits avec écart</span>
      </div>
      <table class="tbl">
        <thead><tr><th>Produit</th><th>Qté Dépôt</th><th>Qté Étagère</th><th>Écart</th><th>Statut</th></tr></thead>
        <tbody>
          <tr>
            <td>Boîte de conserve Heinz 400g</td>
            <td style="font-family:monospace;font-weight:700">10</td>
            <td style="font-family:monospace;color:var(--amber)">—</td>
            <td style="font-family:monospace;font-weight:700;color:var(--amber)">Temp.</td>
            <td><span class="pb tmp">⚠️ Temporairement enlevé</span></td>
          </tr>
          <tr>
            <td>Snack sucré Kinder Bueno</td>
            <td style="font-family:monospace;font-weight:700">22</td>
            <td style="font-family:monospace;color:var(--red)">0</td>
            <td style="font-family:monospace;font-weight:700;color:var(--red)">-22</td>
            <td><span class="pb conf">🔴 Retiré Confirmé</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class StockComponent {
  activeTab = 'etagere';
  search = '';
  tabs = [
    { id: 'etagere', label: '🏪 Étagère (23)' },
    { id: 'depot',   label: '📦 Dépôt (24)'   },
    { id: 'diff',    label: '⚠️ Différence (1)' },
  ];

  etagere = [
    { num:'01', name:"Bouteille d'eau Sidi Ali 50cl",   status:'ON_SHELF',     cls:'on',  qty:'24', qtyColor:'',              conf:'0.94', confColor:'var(--green)', time:'18:35:12' },
    { num:'02', name:'Paquet de pâtes Barilla 500g',    status:'ON_SHELF',     cls:'on',  qty:'24', qtyColor:'',              conf:'0.91', confColor:'var(--green)', time:'18:35:10' },
    { num:'03', name:"Jus d'orange Tropicana 1L",       status:'ON_SHELF',     cls:'on',  qty:'18', qtyColor:'',              conf:'0.89', confColor:'var(--green)', time:'18:35:08' },
    { num:'04', name:'Café Nescafé Classic 200g',       status:'ON_SHELF',     cls:'on',  qty:'15', qtyColor:'',              conf:'0.93', confColor:'var(--green)', time:'18:35:05' },
    { num:'05', name:"Riz Uncle Ben's 1kg",             status:'ON_SHELF',     cls:'on',  qty:'12', qtyColor:'',              conf:'0.88', confColor:'var(--green)', time:'18:35:01' },
    { num:'06', name:'Lait Candia Demi-écrémé 1L',     status:'ON_SHELF',     cls:'on',  qty:'20', qtyColor:'',              conf:'0.92', confColor:'var(--green)', time:'18:34:58' },
    { num:'07', name:'Boîte de conserve Heinz 400g',   status:'TEMP_REMOVED', cls:'tmp', qty:'—',  qtyColor:'var(--amber)',  conf:'0.78', confColor:'var(--amber)', time:'18:34:57' },
    { num:'08', name:"Huile d'olive Puget 75cl",        status:'ON_SHELF',     cls:'on',  qty:'8',  qtyColor:'',              conf:'0.90', confColor:'var(--green)', time:'18:34:55' },
    { num:'09', name:"Chips Lay's Paprika 150g",        status:'ON_SHELF',     cls:'on',  qty:'30', qtyColor:'',              conf:'0.87', confColor:'var(--green)', time:'18:34:50' },
    { num:'10', name:'Snack sucré Kinder Bueno',        status:'REMOVED',      cls:'rm',  qty:'0',  qtyColor:'var(--red)',    conf:'—',    confColor:'var(--red)',   time:'17:33:48' },
  ];

  depot = [
    { num:'01', name:"Bouteille d'eau Sidi Ali 50cl",  qtyD:'24', qtyE:'24', qtyEColor:'',             status:'Complet',      cls:'on'  },
    { num:'02', name:'Paquet de pâtes Barilla 500g',   qtyD:'24', qtyE:'24', qtyEColor:'',             status:'Complet',      cls:'on'  },
    { num:'03', name:"Jus d'orange Tropicana 1L",      qtyD:'20', qtyE:'18', qtyEColor:'',             status:'Partiel',      cls:'on'  },
    { num:'04', name:'Café Nescafé Classic 200g',      qtyD:'15', qtyE:'15', qtyEColor:'',             status:'Complet',      cls:'on'  },
    { num:'05', name:"Riz Uncle Ben's 1kg",            qtyD:'12', qtyE:'12', qtyEColor:'',             status:'Complet',      cls:'on'  },
    { num:'06', name:'Lait Candia Demi-écrémé 1L',    qtyD:'20', qtyE:'20', qtyEColor:'',             status:'Complet',      cls:'on'  },
    { num:'07', name:'Boîte de conserve Heinz 400g',  qtyD:'10', qtyE:'—',  qtyEColor:'var(--amber)', status:'Temp. retiré', cls:'tmp' },
    { num:'08', name:"Huile d'olive Puget 75cl",       qtyD:'8',  qtyE:'8',  qtyEColor:'',             status:'Complet',      cls:'on'  },
    { num:'09', name:"Chips Lay's Paprika 150g",       qtyD:'30', qtyE:'30', qtyEColor:'',             status:'Complet',      cls:'on'  },
    { num:'10', name:'Snack sucré Kinder Bueno',       qtyD:'22', qtyE:'0',  qtyEColor:'var(--red)',   status:'Retiré',       cls:'rm'  },
  ];

  get filteredEtagere() {
    return this.etagere.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
  }
  get filteredDepot() {
    return this.depot.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
  }
}