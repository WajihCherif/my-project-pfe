import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-etat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pg-title"><span class="icon">⏳</span> État du Stock</div>

    <div class="etat-current">
      <div class="etat-label">État Actuel du Système</div>
      <div class="etat-row">
        <div class="etat-state">
          <div>
            <div class="etat-label">Étagère principale</div>
            <div class="state-chip"><div class="dot"></div> ON_SHELF</div>
            <div class="state-timer">Stable depuis {{ timer }}s</div>
          </div>
        </div>
        <div style="text-align:center;padding:0 16px">
          <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700">{{ clock }}</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:4px">Mise à jour en temps réel</div>
        </div>
      </div>
    </div>

    <div class="etat-stats">
      <div class="es gr"><div class="es-val">21</div><div class="es-lbl">ON_SHELF</div></div>
      <div class="es am"><div class="es-val">1</div><div class="es-lbl">TEMP_REMOVED</div></div>
      <div class="es rd"><div class="es-val">1</div><div class="es-lbl">REMOVED</div></div>
      <div class="es bl"><div class="es-val">98%</div><div class="es-lbl">Précision YOLO</div></div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title">📋 État par Produit</span><button class="card-menu">···</button></div>
        <table class="tbl">
          <thead><tr><th>Produit</th><th>État</th><th>Timer</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td>{{ p.name }}</td>
              <td>
                <span class="status-pill" [ngClass]="'sp-'+p.cls">
                  <span class="sp-dot"></span>{{ p.state }}
                </span>
              </td>
              <td>
                <span class="timer-badge" [ngClass]="p.timerCls">{{ p.timer }}</span>
                <div class="timer-progress" *ngIf="p.progress !== null">
                  <div class="timer-progress-bar" [ngClass]="p.cls" [style.width]="p.progress+'%'"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="timeline">
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px">📅 Timeline</div>
        <div class="tl-item" *ngFor="let ev of timeline">
          <div class="tl-dot" [style.background]="ev.color"></div>
          <div class="tl-time">{{ ev.time }}</div>
          <div class="tl-msg">{{ ev.msg }}<small>{{ ev.sub }}</small></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .etat-current { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); margin-bottom:14px; }
    .etat-row { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
    .etat-label { font-size:12px; font-weight:600; color:var(--text-3); text-transform:uppercase; letter-spacing:.5px; margin-bottom:8px; }
    .etat-state { background:var(--green-bg); border:1px solid var(--green-border); border-radius:9px; padding:16px 24px; flex:1; }
    .state-chip { background:var(--green); color:#fff; padding:8px 16px; border-radius:7px; font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:700; display:flex; align-items:center; gap:8px; margin-bottom:4px; width:fit-content; }
    .state-chip .dot { width:8px; height:8px; border-radius:50%; background:#fff; opacity:.85; animation:dp 1.5s infinite; }
    @keyframes dp { 0%,100%{opacity:1;} 50%{opacity:.4;} }
    .state-timer { font-size:13px; color:var(--green); font-weight:500; }
    .status-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; }
    .sp-on  { background:var(--green-bg); color:var(--green); }
    .sp-tmp { background:var(--amber-bg); color:var(--amber); }
    .sp-rm  { background:var(--red-bg);   color:var(--red);   }
    .sp-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
    .timer-badge { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-3); background:var(--surface2); padding:2px 7px; border-radius:5px; }
    .timer-badge.warn   { color:var(--amber); background:var(--amber-bg); }
    .timer-badge.danger { color:var(--red);   background:var(--red-bg);   }
    .timer-progress { height:4px; background:var(--border); border-radius:99px; overflow:hidden; margin-top:4px; }
    .timer-progress-bar { height:100%; border-radius:99px; transition:width .5s; }
    .timer-progress-bar.on  { background:var(--green); }
    .timer-progress-bar.tmp { background:var(--amber); }
    .timer-progress-bar.rm  { background:var(--red);   }
  `]
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