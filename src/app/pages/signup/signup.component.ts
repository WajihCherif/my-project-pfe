import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  nom = '';
  prenom = '';
  email = '';
  mot_de_passe = '';
  role = 'user';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.nom || !this.prenom || !this.email || !this.mot_de_passe) {
      this.error = 'Merci de renseigner tous les champs du formulaire.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.auth.signup({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      mot_de_passe: this.mot_de_passe,
      role: this.role,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.detail || 'Impossible de créer le compte pour le moment.';
      }
    });
  }
}
