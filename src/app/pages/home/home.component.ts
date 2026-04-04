import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public router: Router) {}

  products = [
    { name: "Bouteille d'eau",  status: 'ON_SHELF',      cls: 'on',  qty: 24 },
    { name: 'Boite de conserve',status: 'TEMP_REMOVED',  cls: 'tmp', qty: 23 },
    { name: 'Paquet de pâtes',  status: 'ON_SHELF',      cls: 'on',  qty: 24 },
    { name: 'Snack sucré',      status: 'REMOVED',       cls: 'rm',  qty: 22 },
    { name: 'Produit E',        status: 'ON_SHELF',      cls: 'on',  qty: 9  },
    { name: 'Produit F',        status: 'ON_SHELF',      cls: 'on',  qty: 15 },
    { name: 'Produit G',        status: 'ON_SHELF',      cls: 'on',  qty: 23 },
    { name: 'Produit H',        status: 'ON_SHELF',      cls: 'on',  qty: 12 },
  ];

  problems = [
    { name: 'Boîte de conserve', since: '5s',   label: '⚠️ Temporairement enlevé', cls: 'tmp',  duration: '5s'   },
    { name: 'Snack sucré',       since: '1min', label: '🔴 Retiré Confirmé',        cls: 'conf', duration: '1min' },
    { name: 'Produit X',         since: '',     label: '⚠️ Incohérence stock',      cls: 'inc',  duration: '—'    },
  ];
}