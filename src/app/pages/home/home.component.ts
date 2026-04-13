import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  realProducts: Product[] = [];
  loading = true;

  // Mocked statuses for demo purposes since the backend doesn't have an IOT shelf tracker yet
  liveStatuses = [
    { name: "Bouteille d'eau",  status: 'ON_SHELF',      cls: 'on',  qty: 24 },
    { name: 'Boite de conserve',status: 'TEMP_REMOVED',  cls: 'tmp', qty: 23 },
    { name: 'Paquet de pâtes',  status: 'ON_SHELF',      cls: 'on',  qty: 24 },
    { name: 'Snack sucré',      status: 'REMOVED',       cls: 'rm',  qty: 22 },
  ];

  problems = [
    { name: 'Boîte de conserve', since: '5s',   label: 'Temporairement enlevé', cls: 'tmp',  duration: '5s'   },
    { name: 'Snack sucré',       since: '1min', label: 'Retiré Confirmé',        cls: 'conf', duration: '1min' },
  ];

  constructor(public router: Router, private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.realProducts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get totalProducts() {
    return this.realProducts.length > 0 ? this.realProducts.length : 24;
  }
}