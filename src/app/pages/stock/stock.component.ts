import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
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