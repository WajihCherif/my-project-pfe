import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  nom = '';
  prenom = '';
  email = '';
  mot_de_passe = '';
  role = 'user';
  error = '';
  loading = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.nom || !this.prenom || !this.email || !this.mot_de_passe) {
      this.error = 'Merci de renseigner tous les champs du formulaire.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.auth.register({
      username: this.email, // Using email as username per login pattern
      email: this.email,
      password: this.mot_de_passe,
      role: this.role,
      nom: this.nom,       // Keeping these in case backend uses them
      prenom: this.prenom
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
