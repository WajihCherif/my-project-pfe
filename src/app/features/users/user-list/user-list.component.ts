import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  items: User[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
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
    if (!id || !confirm('Are you sure you want to delete this user?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.message)
    });
  }
}
