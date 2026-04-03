import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="hdr">
      <div class="hdr-alert"><div class="hdr-badge">1</div> Système: ALERT</div>
      <div class="sp"></div>
      <div class="hdr-ok"><div class="hdr-dot"></div> Système: OK</div>
      <div class="hdr-time">{{ currentTime }}</div>
      <div class="hdr-avatar">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar"
             (error)="$any($event.target).style.display='none'">
      </div>
    </header>
  `,
  styles: [`
    .hdr { height:56px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 22px; gap:12px; flex-shrink:0; }
    .hdr-alert { display:flex; align-items:center; gap:7px; font-size:14px; font-weight:700; color:var(--red); }
    .hdr-badge { width:19px; height:19px; background:var(--red); color:#fff; border-radius:50%; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; }
    .hdr-ok { display:flex; align-items:center; gap:7px; font-size:13px; font-weight:700; color:var(--text); }
    .hdr-dot { width:8px; height:8px; border-radius:50%; background:var(--green); animation:pulse 2s infinite; }
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 2px rgba(46,158,91,.25);} 50%{box-shadow:0 0 0 5px rgba(46,158,91,.1);} }
    .hdr-time { font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:600; }
    .hdr-avatar { width:32px; height:32px; border-radius:50%; background:var(--navy-light); overflow:hidden; cursor:pointer; }
    .hdr-avatar img { width:100%; height:100%; object-fit:cover; }
    .sp { flex:1; }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTime = '';
  private timer: any;

  ngOnInit() {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
  }
  ngOnDestroy() { clearInterval(this.timer); }

  updateClock() {
    const now = new Date();
    this.currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
}