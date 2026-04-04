import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserResponse } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  currentUser: UserResponse | null = null;
  nom = '';
  prenom = '';
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

  constructor(private auth: AuthService, public router: Router) {}

  ngOnInit() {
    this.loadAccount();
  }

  loadAccount() {
    this.currentUser = this.auth.getCurrentUser();
    if (!this.currentUser) {
      return;
    }

    this.nom = this.currentUser.nom;
    this.prenom = this.currentUser.prenom;
    this.email = this.currentUser.email;
    this.role = this.currentUser.role;
  }

  saveChanges() {
    if (!this.currentUser) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const payload: Partial<{ nom: string; prenom: string; email: string; mot_de_passe: string; role: string }> = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      role: this.role,
    };

    if (this.mot_de_passe) {
      payload.mot_de_passe = this.mot_de_passe;
    }

    this.auth.updateAccount(this.currentUser.id_utilisateur, payload).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.auth.setCurrentUser(user);
        this.loadAccount();
        this.mot_de_passe = '';
        this.success = 'Compte mis à jour avec succès.';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.detail || 'Impossible de mettre à jour le compte.';
        this.loading = false;
      }
    });
  }

  deleteAccount() {
    if (!this.currentUser || this.deleting) {
      return;
    }

    const confirmed = window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.');
    if (!confirmed) {
      return;
    }

    this.deleting = true;
    this.error = '';

    this.auth.deleteAccount(this.currentUser.id_utilisateur).subscribe({
      next: () => {
        this.auth.clearCurrentUser();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err?.error?.detail || 'Impossible de supprimer le compte.';
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

