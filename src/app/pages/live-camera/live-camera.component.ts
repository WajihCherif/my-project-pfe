import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div class="pg-title" style="margin-bottom:0"><span class="icon">📷</span> Live Camera</div>
      <button class="show-all-btn" [class.active]="showAll" (click)="showAll = !showAll">
        {{ showAll ? '← Vue Unique' : '📷 Show All Cameras' }}
      </button>
    </div>

    <div class="cam-selector-bar">
      <span style="font-size:12px;font-weight:600;color:var(--text-3)">Sélectionnez la caméra :</span>
      <div class="cam-tabs">
        <button class="cam-tab" *ngFor="let c of camKeys"
          [class.active]="activeCam === c" (click)="activeCam = c; showAll = false">
          {{ labels[c] }}
        </button>
      </div>
    </div>

    <!-- Vue unique -->
    <div *ngIf="!showAll">
      <div class="cam-layout">
        <div class="card">
          <div class="card-hdr">
            <span class="card-title">
              📷 {{ data[activeCam].title }}
              <span style="font-size:11px;color:var(--red);font-weight:700;margin-left:6px">● LIVE</span>
            </span>
            <button class="card-menu">···</button>
          </div>
          <div class="card-body">
            <div class="cam-view">
              <div class="shelf-sim">
                <div class="shelf-row">
                  <div style="background:#3b82f6;width:26px;height:20px" class="si det"><span class="bb">0.94</span></div>
                  <div style="background:#2563eb;width:26px;height:20px" class="si"></div>
                  <div style="background:#3b82f6;width:26px;height:20px" class="si det"></div>
                  <div style="background:#60a5fa;width:26px;height:20px" class="si det"></div>
                  <div style="background:#2563eb;width:26px;height:20px" class="si det"></div>
                </div>
                <div class="shelf-row">
                  <div style="background:#ef4444;width:26px;height:24px" class="si"></div>
                  <div style="background:#22c55e;width:26px;height:24px" class="si det"><span class="bb">0.87</span></div>
                  <div style="background:#f97316;width:26px;height:24px" class="si det"></div>
                  <div style="background:#22c55e;width:26px;height:24px" class="si det"></div>
                  <div style="background:#f97316;width:26px;height:24px" class="si det"></div>
                </div>
                <div class="shelf-row">
                  <div style="background:#92400e;width:34px;height:28px" class="si"></div>
                  <div style="background:#78350f;width:34px;height:28px" class="si"></div>
                  <div style="background:#92400e;width:34px;height:28px" class="si"></div>
                  <div style="background:#78350f;width:34px;height:28px" class="si"></div>
                </div>
              </div>
              <div class="rec-badge">REC ●</div>
            </div>
            <div class="cam-footer">
              <div class="det-count">Produits détectés : <strong>{{ data[activeCam].count }}</strong></div>
              <span class="chip on">Stable</span>
            </div>
          </div>
        </div>

        <div class="cam-info">
          <div class="info-box">
            <div class="info-box-title">Infos temps réel</div>
            <div class="info-val gr">{{ data[activeCam].count }}</div>
            <div class="conf-avg">Confiance Moyenne: <span>{{ data[activeCam].conf }}</span></div>
          </div>
          <div class="info-box">
            <div class="info-box-title">État Actuel</div>
            <div class="etat-box">
              <div class="etat-chip"><div class="dot"></div> ON_SHELF</div>
              <div class="etat-timer">0/10s</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-box-title">Source</div>
            <div style="font-size:12px;color:var(--text-2);line-height:1.6">
              <div>🎥 <strong>Webcam</strong> — Flux en direct</div>
              <div>🤖 <strong>YOLO</strong> — Détection objets</div>
              <div style="margin-top:8px;padding:8px;background:var(--green-bg);border-radius:7px;font-size:11px;color:var(--green);font-weight:600">
                Zone étagère analysée par YOLO avec bounding boxes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue toutes les caméras -->
    <div *ngIf="showAll">
      <div class="all-cams-grid">
        <div class="mini-cam-card" *ngFor="let c of camKeys"
          [class.active-cam]="activeCam === c"
          (click)="activeCam = c; showAll = false">
          <div class="mini-cam-view" [style.background]="miniCamBg[c]">
            <div style="display:flex;flex-direction:column;gap:4px;align-items:center;justify-content:center;height:100%;padding:8px">
              <div style="display:flex;gap:3px">
                <div *ngFor="let b of miniBlocks[c]"
                  [style.background]="b.bg" [style.width]="b.w+'px'" [style.height]="b.h+'px'"
                  style="border-radius:2px" [style.border]="b.border || 'none'">
                </div>
              </div>
            </div>
            <div class="mini-rec" [style.color]="c === 'sortie' ? '#f87171' : '#4ade80'">REC ●</div>
          </div>
          <div class="mini-cam-info">
            <div class="mini-cam-name">{{ labels[c] }}</div>
            <div class="mini-cam-stats">
              <span class="chip" [ngClass]="miniChip[c].cls" style="font-size:9px;padding:1px 6px">{{ miniChip[c].label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top:12px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:9px;font-size:12px;color:var(--text-3)">
        💡 Cliquez sur une caméra pour l'afficher en plein écran
      </div>
    </div>
  `
})
export class LiveCameraComponent {
  showAll = false;
  activeCam = 'etagere';
  camKeys = ['etagere', 'depot', 'entree', 'sortie'];

  labels: Record<string, string> = {
    etagere: '🏪 Étagère A', depot: '📦 Dépôt B',
    entree: '🚪 Entrée C',  sortie: '🔚 Sortie D',
  };

  data: Record<string, any> = {
    etagere: { title: 'Étagère A',  count: 23, conf: '0,92' },
    depot:   { title: 'Dépôt B',   count: 24, conf: '0,88' },
    entree:  { title: 'Entrée C',  count: 3,  conf: '0,75' },
    sortie:  { title: 'Sortie D',  count: 1,  conf: '0,70' },
  };

  miniCamBg: Record<string, string> = {
    etagere: 'linear-gradient(135deg,#1a2a3a,#2c3e50)',
    depot:   'linear-gradient(135deg,#1c2a1a,#2d3b2c)',
    entree:  'linear-gradient(135deg,#1a1a2e,#2c2c50)',
    sortie:  'linear-gradient(135deg,#1e1a1a,#3b2c2c)',
  };

  miniBlocks: Record<string, any[]> = {
    etagere: [
      {bg:'#3b82f6',w:16,h:12,border:'1px solid #4ade80'},
      {bg:'#22c55e',w:16,h:12,border:'1px solid #4ade80'},
      {bg:'#ef4444',w:16,h:12},
      {bg:'#3b82f6',w:16,h:12,border:'1px solid #4ade80'},
    ],
    depot: [
      {bg:'#78350f',w:20,h:16,border:'1px solid #86efac'},
      {bg:'#92400e',w:20,h:16,border:'1px solid #86efac'},
      {bg:'#78350f',w:20,h:16,border:'1px solid #86efac'},
    ],
    entree: [
      {bg:'#6366f1',w:18,h:14,border:'1px solid #a5b4fc'},
      {bg:'#4f46e5',w:18,h:14,border:'1px solid #a5b4fc'},
      {bg:'#6366f1',w:18,h:14,border:'1px solid #a5b4fc'},
    ],
    sortie: [
      {bg:'#dc2626',w:18,h:14,border:'1px solid #fca5a5'},
      {bg:'#b91c1c',w:18,h:14,border:'1px solid #fca5a5'},
      {bg:'#dc2626',w:18,h:14},
    ],
  };

  miniChip: Record<string, any> = {
    etagere: { cls: 'on',  label: '23 produits'  },
    depot:   { cls: 'on',  label: '24 produits'  },
    entree:  { cls: 'tmp', label: '3 mouvements' },
    sortie:  { cls: 'rm',  label: '1 alerte'     },
  };
}