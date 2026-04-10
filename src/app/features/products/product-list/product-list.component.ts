import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  items: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems() {
    if (!this.searchTerm) return this.items;
    return this.items.filter(i => JSON.stringify(i).toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  deleteItem(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
