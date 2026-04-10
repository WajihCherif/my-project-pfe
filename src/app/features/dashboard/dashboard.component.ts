import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { DepotService } from '../../core/services/depot.service';
import { EtagereService } from '../../core/services/etagere.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalDepots = 0;
  totalEtageres = 0;
  totalUsers = 0;
  loading = true;

  constructor(
    private productService: ProductService,
    private depotService: DepotService,
    private etagereService: EtagereService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getAll(),
      depots:   this.depotService.getAll(),
      etageres: this.etagereService.getAll(),
      users:    this.userService.getAll(),
    }).subscribe({
      next: (results) => {
        this.totalProducts = results.products.length;
        this.totalDepots   = results.depots.length;
        this.totalEtageres = results.etageres.length;
        this.totalUsers    = results.users.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.loading = false;
      }
    });
  }
}
