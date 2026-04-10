import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepotService } from '../../../core/services/depot.service';
import { Depot } from '../../../shared/models/depot.model';

@Component({
  selector: 'app-depot-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './depot-list.component.html'
})
export class DepotListComponent implements OnInit {
  items: Depot[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private depotService: DepotService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.depotService.getAll().subscribe({
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
    if (!id || !confirm('Are you sure you want to delete this depot?')) return;
    this.depotService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
