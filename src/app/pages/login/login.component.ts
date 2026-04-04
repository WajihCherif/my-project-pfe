import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  mot_de_passe = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.mot_de_passe) {
      this.error = 'Merci de renseigner l’email et le mot de passe.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.mot_de_passe).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.detail || 'Échec de connexion, vérifiez vos informations.';
      }
    });
  }
}
