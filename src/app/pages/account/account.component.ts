import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;
  username = '';
  email = '';
  role = '';
  mot_de_passe = '';
  error = '';
  success = '';
  loading = false;
  deleting = false;

  loginHistory = [
    { date:"Aujourd'hui, 14:52", ip:'192.168.1.5' },
    { date:'Hier, 09:37', ip:'192.168.1.5' },
    { date:'22 avril, 17:10', ip:'192.168.1.90' },
    { date:'21 avril, 13:45', ip:'192.168.1.23' },
  ];

  constructor(
    private auth: AuthService, 
    private userService: UserService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadAccount();
  }

  loadAccount() {
    this.currentUser = this.auth.getCurrentUser();
    if (!this.currentUser) {
      return;
    }

    this.username = this.currentUser.username;
    this.email = this.currentUser.email;
    this.role = this.currentUser.role;
  }

  saveChanges() {
    if (!this.currentUser || !this.currentUser.id) {
      return;
    }

    this.loading = true;

    const payload: any = {
      username: this.username,
      email: this.email,
      role: this.role,
    };

    if (this.mot_de_passe) {
      payload.password = this.mot_de_passe;
    }

    this.userService.update(this.currentUser.id, payload).subscribe({
      next: (user: User) => {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        this.loadAccount();
        this.mot_de_passe = '';
        this.success = 'Compte mis à jour avec succès.';
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.message || 'Impossible de mettre à jour le compte.';
        this.loading = false;
      }
    });
  }

  deleteAccount() {
    if (!this.currentUser || !this.currentUser.id || this.deleting) {
      return;
    }

    const confirmed = window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.');
    if (!confirmed) {
      return;
    }

    this.deleting = true;
    this.error = '';

    this.userService.delete(this.currentUser.id).subscribe({
      next: () => {
        this.auth.logout();
      },
      error: (err: any) => {
        this.error = err?.message || 'Impossible de supprimer le compte.';
        this.deleting = false;
      }
    });
  }

  resetForm() {
    this.error = '';
    this.success = '';
    this.mot_de_passe = '';
    this.loadAccount();
  }
}
