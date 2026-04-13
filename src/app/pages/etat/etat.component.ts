import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';

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

  // Track the actual backend products
  realProducts: Product[] = [];
  
  // Mixed Array for DEMO purpose: We will map real products randomly to mock states
  demoStates: any[] = [];

  timeline = [
    { time: '', color: '#1cc88a', msg: 'Système YOLO v8 Analysant', sub: 'Tous les capteurs fonctionnels' },
    { time: '', color: '#f6c23e', msg: 'Inspectant les zones',       sub: 'Recherche de changements...' },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.tick();
    this.iv = setInterval(() => this.tick(), 1000);

    // Fetch real products to make the view semi-dynamic
    this.productService.getAll().subscribe({
      next: (data) => {
        this.realProducts = data;
        this.generateDemoStates();
      }
    });
  }

  ngOnDestroy() { 
    if (this.iv) clearInterval(this.iv); 
  }

  tick() {
    this.timer++;
    const n = new Date();
    this.clock = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
  }

  // Purely visual logic for demonstration uses
  generateDemoStates() {
    this.demoStates = this.realProducts.map((p, index) => {
      // Create some fake states for the demo
      if (index === 1) {
        return { name: p.name, state: 'TEMP_REMOVED', cls: 'warning', timer: '5s / 10s', progress: 50 };
      } else if (index === 2) {
        return { name: p.name, state: 'REMOVED', cls: 'danger', timer: 'Confirmé', progress: 100 };
      }
      return { name: p.name, state: 'ON_SHELF', cls: 'success', timer: '—', progress: null };
    });

    if (this.demoStates.length === 0) {
      // Fallback if no products in DB
      this.demoStates = [
        { name: "Bouteille d'eau", state: 'ON_SHELF', cls: 'success', timer: '—', progress: null },
        { name: "Boîte de conserve", state: 'TEMP_REMOVED', cls: 'warning', timer: '5s / 10s', progress: 50 },
        { name: "Snack sucré", state: 'REMOVED', cls: 'danger', timer: 'Confirmé', progress: 100 }
      ];
    }

    const n = new Date();
    this.timeline[0].time = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
    n.setMinutes(n.getMinutes() - 2);
    this.timeline[1].time = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
  }

  get onShelfCount() {
    return this.demoStates.filter(d => d.state === 'ON_SHELF').length;
  }
  
  get tempRemovedCount() {
    return this.demoStates.filter(d => d.state === 'TEMP_REMOVED').length;
  }

  get removedCount() {
    return this.demoStates.filter(d => d.state === 'REMOVED').length;
  }
}