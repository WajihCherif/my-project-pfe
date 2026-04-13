import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-camera.component.html',
  styleUrls: ['./live-camera.component.css']
})
export class LiveCameraComponent implements OnInit {
  showAll = false;
  activeCam = 'etagere';
  camKeys = ['etagere', 'depot', 'entree', 'sortie'];

  labels: Record<string, string> = {
    etagere: '🏪 Étagère A', depot: '📦 Dépôt B',
    entree: '🚪 Entrée C',  sortie: '🔚 Sortie D',
  };

  data: Record<string, any> = {
    etagere: { title: 'Étagère A', count: 0, conf: '0,92' },
    depot:   { title: 'Dépôt B',   count: 0, conf: '0,88' },
    entree:  { title: 'Entrée C',  count: 3, conf: '0,75' },
    sortie:  { title: 'Sortie D',  count: 1, conf: '0,70' },
  };

  miniCamBg: Record<string, string> = {
    etagere: 'linear-gradient(135deg, rgba(26, 42, 58, 0.8), rgba(44, 62, 80, 0.8))',
    depot:   'linear-gradient(135deg, rgba(28, 42, 26, 0.8), rgba(45, 59, 44, 0.8))',
    entree:  'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(44, 44, 80, 0.8))',
    sortie:  'linear-gradient(135deg, rgba(30, 26, 26, 0.8), rgba(59, 44, 44, 0.8))',
  };

  miniBlocks: Record<string, any[]> = {
    etagere: [
      { bg: '#3b82f6', w: 16, h: 12, border: '2px solid transparent' },
      { bg: '#22c55e', w: 16, h: 12, border: '2px dashed #4ade80' },
      { bg: '#ef4444', w: 16, h: 12, border: '2px solid transparent' },
      { bg: '#3b82f6', w: 16, h: 12, border: '2px solid #4ade80' },
    ],
    depot: [
      { bg: '#78350f', w: 20, h: 16, border: '2px solid transparent' },
      { bg: '#92400e', w: 20, h: 16, border: '2px solid #86efac' },
      { bg: '#78350f', w: 20, h: 16, border: '2px dashed transparent' },
    ],
    entree: [
      { bg: '#6366f1', w: 18, h: 14, border: '2px solid #a5b4fc' },
      { bg: '#4f46e5', w: 18, h: 14, border: '2px dashed transparent' },
      { bg: '#6366f1', w: 18, h: 14, border: '2px solid transparent' },
    ],
    sortie: [
      { bg: '#dc2626', w: 18, h: 14, border: '2px dashed #fca5a5' },
      { bg: '#b91c1c', w: 18, h: 14, border: '2px solid transparent' },
      { bg: '#dc2626', w: 18, h: 14, border: '2px solid transparent' },
    ],
  };

  miniChip: Record<string, any> = {
    etagere: { cls: 'success', label: '0 produits' },
    depot:   { cls: 'success', label: '0 produits' },
    entree:  { cls: 'warning', label: '3 mouvements' },
    sortie:  { cls: 'danger',  label: '1 alerte' },
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (products) => {
        const total = products.length;
        
        // Distribute real total across mock locations
        const half = Math.floor(total / 2);
        this.data['etagere'].count = half;
        this.data['depot'].count = total - half;

        this.miniChip['etagere'].label = `${half} produits`;
        this.miniChip['depot'].label = `${total - half} produits`;
      },
      error: () => {
        this.data['etagere'].count = 23;
        this.data['depot'].count = 24;
        this.miniChip['etagere'].label = '23 produits';
        this.miniChip['depot'].label = '24 produits';
      }
    });
  }
}