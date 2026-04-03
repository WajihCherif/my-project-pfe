import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:20px;font-weight:700;display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:var(--navy);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px">👤</div>
        Account
      </div>
      <button style="background:var(--navy);color:#fff;border:none;padding:9px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">
        ✏️ Modifier le profil ›
      </button>
    </div>

    <div class="search">
      <span style="color:var(--text-3)">🔍</span>
      <input type="text" placeholder="Rechercher...">
    </div>

    <div class="profile-card">
      <div class="pf-left">
        <div class="av-lg">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe"
               (error)="$any($event.target).style.display='none'">
        </div>
        <div class="pf-name">John Doe</div>
        <div class="pf-role-badge">Administrateur</div>
      </div>
      <div class="pf-fields" style="padding-left:8px">
        <div class="pf-grid">
          <div class="pf-lbl">Nom d'utilisateur</div><div class="pf-val">admin</div>
          <div class="pf-lbl">Adresse e-mail</div><div class="pf-val">admin&#64;stockmon.io</div>
          <div class="pf-lbl">Rôle</div><div class="pf-val">Administrateur</div>
        </div>
        <div class="pf-divider"></div>
        <div class="pf-grid">
          <div class="pf-lbl">Téléphone</div><div class="pf-val">+216 XX XXX XXX</div>
          <div class="pf-lbl">Département</div><div class="pf-val">Administrateur</div>
        </div>
      </div>
    </div>

    <div class="g2">
      <div class="login-hist-card">
        <div class="login-hist-hdr">
          <span class="card-title">Login History</span>
          <button class="card-menu">···</button>
        </div>
        <table class="tbl">
          <thead><tr><th>Date</th><th>IP</th><th>Résultat</th></tr></thead>
          <tbody>
            <tr *ngFor="let log of loginHistory">
              <td>{{ log.date }}</td>
              <td style="font-family:monospace;font-size:11px">{{ log.ip }}</td>
              <td><span class="ok-res">✅ Succès</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title">🔐 Sécurité</span></div>
        <div class="card-body">
          <div class="sec-item ok">
            <div class="sec-item-info">
              <div class="sec-item-title">🔒 Mot de passe</div>
              <div class="sec-item-sub">Dernière modif: il y a 30j</div>
            </div>
            <button class="sec-btn outline-green">Changer</button>
          </div>
          <div class="sec-item neutral">
            <div class="sec-item-info">
              <div class="sec-item-title">🔐 Auth 2 facteurs</div>
              <div class="sec-item-sub">Non activée</div>
            </div>
            <button class="sec-btn navy">Activer</button>
          </div>
          <div class="sec-item neutral">
            <div class="sec-item-info">
              <div class="sec-item-title">📱 Sessions actives</div>
              <div class="sec-item-sub">2 appareils connectés</div>
            </div>
            <button class="sec-btn outline-red">Gérer</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AccountComponent {
  loginHistory = [
    { date:"Aujourd'hui, 14:52", ip:'192.168.1.5'  },
    { date:'Hier, 09:37',        ip:'192.168.1.5'  },
    { date:'22 avril, 17:10',    ip:'192.168.1.90' },
    { date:'21 avril, 13:45',    ip:'192.168.1.23' },
  ];
}