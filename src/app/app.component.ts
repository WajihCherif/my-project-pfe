import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout container-fluid p-0">
      <div class="row g-0 min-vh-100">
        <div class="col-auto">
          <app-sidebar></app-sidebar>
        </div>
        <div class="col d-flex flex-column">
          <app-header></app-header>
          <main class="flex-grow-1 overflow-auto py-4 px-4 bg-light">
            <div class="container-fluid px-0">
              <router-outlet></router-outlet>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-layout { min-height: 100vh; }
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .pages { flex: 1; overflow-y: auto; padding: 20px 22px; }
    .pages::-webkit-scrollbar { width: 4px; }
    .pages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
  `]
})
export class AppComponent {}