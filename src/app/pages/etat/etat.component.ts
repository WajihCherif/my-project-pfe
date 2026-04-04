import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-etat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etat.component.html',
  styleUrls: ['./etat.component.css']
})
export class EtatComponent implements OnInit, OnDestroy {
  timer = 0;
  clock = '';
  private iv: any;

  products = [
    { name:"Bouteille d'eau",   state:'ON_SHELF',     cls:'on',  timer:'—',         timerCls:'',       progress: null },
    { name:'Paquet de pâtes',   state:'ON_SHELF',     cls:'on',  timer:'—',         timerCls:'',       progress: null },
    { name:"Jus d'orange",      state:'ON_SHELF',     cls:'on',  timer:'—',         timerCls:'',       progress: null },
    { name:'Boîte de conserve', state:'TEMP_REMOVED', cls:'tmp', timer:'5s / 10s',  timerCls:'warn',   progress: 50   },
    { name:'Snack sucré',       state:'REMOVED',      cls:'rm',  timer:'Confirmé',  timerCls:'danger', progress: 100  },
    { name:'Café Nescafé',      state:'ON_SHELF',     cls:'on',  timer:'—',         timerCls:'',       progress: null },
    { name:"Riz Uncle Ben's",   state:'ON_SHELF',     cls:'on',  timer:'—',         timerCls:'',       progress: null },
  ];

  timeline = [
    { time:'18:35', color:'var(--green)', msg:'ON_SHELF détecté',       sub:"Bouteille d'eau — Conf: 0.94" },
    { time:'18:30', color:'var(--amber)', msg:'TEMP_REMOVED déclenché', sub:'Boîte de conserve — 5s'       },
    { time:'17:33', color:'var(--red)',   msg:'REMOVED confirmé',       sub:'Snack sucré — Après 10s'      },
    { time:'10:22', color:'var(--green)', msg:'État rétabli',           sub:'Produit X — ON_SHELF'         },
    { time:'09:15', color:'var(--blue)',  msg:'Système démarré',        sub:'YOLO v8 initialisé'           },
  ];

  ngOnInit() {
    this.tick();
    this.iv = setInterval(() => this.tick(), 1000);
  }
  ngOnDestroy() { clearInterval(this.iv); }

  tick() {
    this.timer++;
    const n = new Date();
    this.clock = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
  }
}