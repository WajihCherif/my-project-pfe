import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-camera.component.html',
  styleUrls: ['./live-camera.component.css']
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