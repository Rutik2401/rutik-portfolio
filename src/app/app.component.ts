import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LenisScrollService } from './services/lenis-scroll.service';
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
    <footer class="border-t border-white/5 py-8 text-center">
      <p class="text-muted text-sm font-mono">
        Crafted with <span class="text-accent">Angular</span> + <span class="text-accent-cyan">GSAP</span>
        &nbsp;·&nbsp; &copy; 2025 Rutik Pimpale
      </p>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    main { display: block; }
    footer { background: #030712; }
  `],
})
export class AppComponent implements OnInit {
  constructor(
    private lenisScroll: LenisScrollService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.lenisScroll.init();
    }
  }
}
