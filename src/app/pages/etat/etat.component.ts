import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { EtagereService } from '../../core/services/etagere.service';
import { Product } from '../../shared/models/product.model';
import { Etagere } from '../../shared/models/etagere.model';

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

  // Track the actual backend data
  realProducts: Product[] = [];
  etageres: Etagere[] = [];
  
  // Mixed Array for DEMO purpose: We will map real products randomly to mock states
  demoStates: any[] = [];

  timeline = [
    { time: '', color: '#1cc88a', msg: 'Système YOLO v8 Analysant', sub: 'Tous les capteurs fonctionnels' },
    { time: '', color: '#f6c23e', msg: 'Inspectant les zones',       sub: 'Recherche de changements...' },
  ];

  constructor(
    private productService: ProductService,
    private etagereService: EtagereService
  ) {}

  ngOnInit() {
    this.tick();
    this.iv = setInterval(() => this.tick(), 1000);

    // Fetch real data to make the view fully dynamic
    forkJoin({
      products: this.productService.getAll(),
      etageres: this.etagereService.getAll()
    }).subscribe({
      next: (data) => {
        this.realProducts = data.products;
        this.etageres = data.etageres;
        this.generateRealStates();
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

  // Dynamically map etageres to states for visualization
  generateRealStates() {
    this.demoStates = this.etageres.map((e) => {
      const prod = this.realProducts.find(p => p.id === e.product_id);
      const name = prod ? prod.name : (e.name || e.etagere_code);
      
      let state = 'ON_SHELF';
      let cls = 'success';
      let progress: number | null = null;

      if (!e.quantity_etagere || e.quantity_etagere === 0) {
        state = 'REMOVED';
        cls = 'danger';
        progress = 100;
      } else if (e.max_capacity && (e.quantity_etagere / e.max_capacity) <= 0.2) {
        state = 'TEMP_REMOVED';
        cls = 'warning';
        progress = (e.quantity_etagere / e.max_capacity) * 100;
      }

      return {
        name: name,
        state: state,
        cls: cls,
        timer: state === 'ON_SHELF' ? '—' : state === 'REMOVED' ? 'Confirmé' : 'Seuil Bas',
        progress: progress
      };
    });

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