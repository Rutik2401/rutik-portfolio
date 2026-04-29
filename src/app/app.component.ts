import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LenisScrollService } from './services/lenis-scroll.service';
import { RevealService } from './services/reveal.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { BootScreenComponent } from './components/boot-screen/boot-screen.component';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BootScreenComponent,
    ScrollProgressComponent,
    NavbarComponent,
    CursorComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-boot-screen />
    <app-scroll-progress />
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
    <app-footer />
  `,
  styles: [`
    :host { display: block; }
    main { display: block; }
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
