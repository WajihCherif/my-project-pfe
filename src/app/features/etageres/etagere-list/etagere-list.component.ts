import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EtagereService } from '../../../core/services/etagere.service';
import { Etagere } from '../../../shared/models/etagere.model';

@Component({
  selector: 'app-etagere-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './etagere-list.component.html'
})
export class EtagereListComponent implements OnInit {
  items: Etagere[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private etagereService: EtagereService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.etagereService.getAll().subscribe({
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
    if (!id || !confirm('Are you sure you want to delete this etagere?')) return;
    this.etagereService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
