import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <div class="main">
        <app-header></app-header>
        <div class="pages">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; overflow: hidden; }
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .pages { flex: 1; overflow-y: auto; padding: 20px 22px; }
    .pages::-webkit-scrollbar { width: 4px; }
    .pages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
  `]
})
export class AppComponent {}