import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  mot_de_passe = '';
  error = '';
  loading = false;
  users: User[] = [];
  searchUser = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  get filteredUsers(): User[] {
    const s = this.searchUser.toLowerCase();
    return this.users.filter(u => 
      (u.username || '').toLowerCase().includes(s) || 
      (u.email || '').toLowerCase().includes(s)
    );
  }

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
