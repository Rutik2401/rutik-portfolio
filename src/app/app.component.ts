import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LenisScrollService } from './services/lenis-scroll.service';
import { RevealService } from './services/reveal.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    CursorComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
  ],
  template: `
    <app-cursor />
    <app-navbar />
    <main>
      <app-hero />
      <app-about />
      <app-skills />
      <app-projects />
      <app-experience />
      <app-contact />
    </main>
    <footer class="site-footer">
      <div class="container-custom mx-auto px-6">
        <div class="footer-grid">
          <div>
            <p class="footer-label">// END OF TRANSMISSION</p>
            <p class="footer-name">RUTIK PIMPALE</p>
          </div>
          <div class="footer-links">
            <a href="https://github.com/Rutik2401" target="_blank" rel="noopener noreferrer">github</a>
            <span>/</span>
            <a href="https://www.linkedin.com/in/rutik-pimpale/" target="_blank" rel="noopener noreferrer">linkedin</a>
            <span>/</span>
            <a href="mailto:rutikpimpale2401@gmail.com">email</a>
          </div>
          <p class="footer-meta">
            &copy; 2025 &nbsp;·&nbsp; ANGULAR + TAILWIND &nbsp;·&nbsp; HAND-CODED
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    main { display: block; }

    .site-footer {
      background: #050505;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 3rem 0 2.5rem;
      font-family: 'JetBrains Mono', monospace;
      color: rgba(255, 255, 255, 0.55);
    }
    .footer-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: flex-start;
    }
    @media (min-width: 768px) {
      .footer-grid {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    .footer-label {
      font-size: 0.66rem;
      letter-spacing: 0.22em;
      color: #c9a86a;
      margin: 0 0 0.4rem;
    }
    .footer-name {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #fafafa;
      margin: 0;
    }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }
    .footer-links a {
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      transition: color 0.2s ease;
      cursor: none;
    }
    .footer-links a:hover { color: #c9a86a; }
    .footer-links span { color: rgba(255, 255, 255, 0.18); }
    .footer-meta {
      font-size: 0.66rem;
      letter-spacing: 0.18em;
      color: rgba(255, 255, 255, 0.32);
      margin: 0;
    }
  `],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private lenisScroll: LenisScrollService,
    private reveal: RevealService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.lenisScroll.init();
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // All section components have rendered by now — start watching reveals.
    this.reveal.init();
  }
}
