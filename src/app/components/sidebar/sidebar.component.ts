import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="logo-wrap">
        <div class="logo-icon">🛡️</div>
        <div class="logo-txt">Stock<br>Monitoring</div>
      </div>
      <div class="nav">
        <a class="nav-btn" routerLink="/home"      routerLinkActive="active"><span class="ni">🏠</span> Home</a>
        <a class="nav-btn" routerLink="/camera"    routerLinkActive="active"><span class="ni">📷</span> Live Camera</a>
        <a class="nav-btn" routerLink="/stock"     routerLinkActive="active"><span class="ni">📦</span> Stock</a>
        <a class="nav-btn" routerLink="/etat"      routerLinkActive="active"><span class="ni">⏳</span> État</a>
        <a class="nav-btn" routerLink="/alerts"    routerLinkActive="active">
          <span class="ni">🔔</span> Alerts <span class="nbadge r">3</span>
        </a>
        <a class="nav-btn" routerLink="/dashboard" routerLinkActive="active">
          <span class="ni">📊</span> Dashboard <span class="nbadge a">1</span>
        </a>
        <a class="nav-btn" routerLink="/logs"      routerLinkActive="active"><span class="ni">🕐</span> Logs</a>
        <a class="nav-btn" routerLink="/account"   routerLinkActive="active"><span class="ni">👤</span> Account</a>
      </div>
      <button class="logout">⏻ Logout</button>
    </nav>
  `,
  styles: [`
    .sidebar { width:230px; background:var(--navy); display:flex; flex-direction:column; flex-shrink:0; height:100vh; }
    .logo-wrap { padding:18px 16px; display:flex; align-items:center; gap:10px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .logo-icon { width:36px; height:36px; background:var(--orange); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:17px; }
    .logo-txt { color:#fff; font-weight:700; font-size:13px; line-height:1.3; }
    .nav { padding:12px 8px; flex:1; overflow-y:auto; }
    .nav-btn { display:flex; align-items:center; gap:9px; padding:9px 11px; border-radius:7px; color:rgba(255,255,255,0.6); font-size:13.5px; font-weight:500; cursor:pointer; transition:all .15s; margin-bottom:1px; text-decoration:none; width:100%; }
    .nav-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }
    .nav-btn.active { background:rgba(255,255,255,0.15); color:#fff; }
    .nav-btn .ni { font-size:15px; width:19px; text-align:center; }
    .nbadge { margin-left:auto; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:20px; min-width:18px; text-align:center; }
    .nbadge.r { background:var(--red); }
    .nbadge.a { background:var(--amber); }
    .logout { margin:10px 8px; padding:10px; background:#b91c1c; color:#fff; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; }
    .logout:hover { background:#dc2626; }
  `]
})
export class SidebarComponent {}